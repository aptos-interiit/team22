/// With the NFT DAO, token holders can
/// - be able to create a DAO and connect it to their existing NFT project
/// - be able to create proposals that can be voted on-chain
/// - be able to have proposal results concluded and executed on-chain
///
/// An example e2e flow. For more details check the An Example E2E Flow section
/// There are multiple roles: DAO platform operator, DAO creator, proposer and voter.
/// 1. Platform operator deploys this package to create a DAO platform. They can deploy the contract as immutable to
/// enable trustlessness.
/// 2. DAO creator calls create_dao to create their DAO. This will create the DAO in a separate resource account.
/// 3. A proposer can specify the DAO they want to create a proposal and create the proposal through create_proposal
///    A proposal can execute a list of functions of 3 types. eg: transferring multiple NFTs can be a proposal of multiple offer_nft function:
///         a: no-op, no execution happens on chain. Only the proposal and its results are recorded on-chain for DAO
///            admin to take actions off-chain
///         b: Transfer APT funds: from DAO account to the specified destination account.
///         c: Offer NFTs to the specified destination account.
/// 4. A voter can vote for a proposal of a DAO through vote.
/// 5. Anyone can call the resolve to resolve a proposal. A proposal voting duration has to expire and the proposal
/// should have more votes than the minimal required threshold.
///
/// The DAO plaform also support admin operations. For more details, check readme Special DAO Admin Functions section
///
/// An example of DAO removal from existing DAO plaform.
/// 1. The DAO creator can call reclaim_signer_capability to remove their DAO from the platform and get back her
/// resource account's signercapability
module sender::nft_dao {
    use aptos_framework::account::{SignerCapability};
    use aptos_framework::account;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_std::table::Table;
    use aptos_std::table;
    use aptos_token::property_map::PropertyMap;
    use aptos_token::property_map;
    use aptos_token::token::{Self, TokenId, create_token_id_raw};
    use sender::bucket_table::BucketTable;
    use sender::bucket_table;
    use sender::nft_dao_events::{Self, emit_create_dao_event};
    use std::bcs;
    use std::error;
    use std::option::{Self, Option};
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_token::token_transfers;
    use sender::music_platform::{fetch_entry, is_song_exists, is_artist_exist,
        resolve_delete_song, resolve_delete_artist
    };

    /// This account doesn't have enough voting power
    const EVOTING_POWER_NOT_ENOUGH: u64 = 1;

    /// This account doesn't own this DAO's voting token
    const ENOT_OWN_THE_VOTING_DAO_TOKEN: u64 = 2;

    /// This function is not supported in proposal
    const ENOT_SUPPROTED_FUNCTION: u64 = 3;

    /// Can only propose a start time in future
    const EPROPOSAL_START_TIME_SHOULD_BE_IN_FUTURE: u64 = 4;

    /// Invalid admin account
    const EINVALID_ADMIN_ACCOUNT: u64 = 5;

    /// String length exceeds limits
    const ESTRING_TOO_LONG: u64 = 6;

    /// Proposal ended and no more voting
    const EPROPOSAL_ENDED: u64 = 7;

    /// Proposal has not ended yet
    const EPROPOSAL_NOT_END: u64 = 8;

    /// Proposal has not started voting
    const EPROPOSAL_NOT_STARTED: u64 = 9;

    /// Proposal has already been resolved
    const EPROPOSAL_RESOLVED: u64 = 10;

    /// Token already voted for the proposal
    const ETOKEN_ALREADY_VOTED: u64 = 11;

    /// DAO doesn't exist at this address
    const EDAO_NOT_EXIST: u64 = 12;

    /// Proposal resource not created
    const EPRPOSALS_NOT_EXIST_AT_ADDRESS: u64 = 13;

    /// Proposal with specified id doesn't exist
    const EPRPOSAL_ID_NOT_EXIST: u64 = 14;

    /// Token already used for creating proposal
    const ETOKEN_USED_FOR_CREATING_PROPOSAL: u64 = 15;

    /// DAO already offered for the new admin
    const EADMIN_ALREADY_OFFERED: u64 = 16;

    /// DAO offer doesn't exist
    const EADMIN_OFFER_NOT_EXIST: u64 = 17;

    /// Token name count doesn't match property_version count
    const ETOKEN_NAME_COUNT_NOT_MATCH_PROPERTY_VERSION_COUNT: u64 = 18;

    /// Proposal arguments count doesn't match function count
    const EPROPOSAL_ARG_COUNT_NOT_MATCH_FUNCTION_COUNT: u64 = 19;

    /// Proposal not found
    const EPROPOSAL_NOT_FOUND: u64 = 20;

    /// Voting statistics resource cannot be found. The DAO might have been incorrectly initialized
    const EVOTING_STATISTICS_NOT_FOUND: u64 = 21;

    /// Stakes are not enough to create a proposal
    const ESTAKES_NOT_ENOUGH: u64 = 22;

    /// Proposal id should be between in range [0, 2]
    const INVALID_PROPOSAL_ID: u64 = 23;

    /// Song id is not valid
    const INVALID_SONG_ID: u64 = 24;

    /// Artist address is not valid
    const INVALID_ARTIST_ADDRESS: u64 = 25;

    /// Song id does not exist
    const SONG_NOT_FOUND: u64 = 26;

    /// Artist address does not exist
    const ARTIST_NOT_FOUND: u64 = 27;

    /// Constants that represent the different state of DAO proposals.
    const PROPOSAL_PENDING: u8 = 0;
    const PROPOSAL_RESOLVED_PASSED: u8 = 1;
    const PROPOSAL_RESOLVED_NOT_PASSED: u8 = 2;
    const PROPOSAL_RESOLVED_BY_ADMIN: u8 = 3;
    const PROPOSAL_VETOED_BY_ADMIN: u8 = 4;

    /// The core struct that contains details and configurations of the DAO.
    struct DAO has key {
        /// Name of the DAO
        name: String,
        /// The minimum number of total votes (both yes and no) a proposal must have in order to be considered valid.
        /// A proposal still needs more yes than no to pass.
        resolve_threshold: u64,
        /// The NFT Collection that is used to govern the DAO.
        governance_token: GovernanceToken,
        /// The voting duration in secs.
        voting_duration: u64,
        /// Minimum required voting power (number of NFT tokens) an account must have to create a proposal.
        min_required_proposer_voting_power: u64,
        /// The id that will be used for the next proposal.
        next_proposal_id: u64,
        /// The signer capability for the resource account where the DAO is hosted (aka the DAO account).
        dao_signer_capability: SignerCapability,
        /// The address of the DAO's admin who has certain permissions over the DAO.
        /// This can be set to 0x0 to remove all admin powers.
        admin: address,
        /// The pending claims waiting for new admin to claim
        pending_admin: Option<address>,
    }

    /// The collection should only contain globally unique NFTs
    /// The total supply is fixed with the token names.
    struct GovernanceToken has drop, store {
        /// The creator address of this NFT collection
        creator: address,
        /// The collection name
        collection: String,
    }

    /// All proposals
    struct Proposals has key {
        proposals: Table<u64, Proposal>
    }

    /// Store the general information about a proposal
    struct Proposal has key, copy, drop, store {
        /// Name of the proposal, limiting to 64 chars
        name: String,
        /// Description of the proposal, limiting to 512 chars
        proposal_type: u64,
        description: String,
        song_id: u64,
        artist_address: address,
        /// The start time of the voting
        start_time_sec: u64,
        /// Proposal results, unresolved, passed, not passed
        resolution: u8,
        /// final voting count of yes votes
        final_yes_votes: u64,
        /// final voting count of no votes
        final_no_votes: u64,
    }

    struct ProposalVotingStatistics has key {
        proposals: Table<u64, VotingStatistics>,
    }

    struct VotingStatistics has key, store {
        /// Total yes votes
        total_yes: u64,
        /// Total no notes
        total_no: u64,
        /// Token voted yes
        yes_votes: BucketTable<TokenId, address>,
        // address is the original voter's address for keeping a record of who voted
        /// Token voted no
        no_votes: BucketTable<TokenId, address>,
    }

    //////////////////// All view functions ////////////////////////////////

    #[view]
    /// Get the proposal
    public fun get_proposal(proposal_id: u64, nft_dao: address): Proposal acquires Proposals {
        assert!(exists<Proposals>(nft_dao), error::not_found(EPRPOSALS_NOT_EXIST_AT_ADDRESS));
        let proposals = &borrow_global<Proposals>(nft_dao).proposals;
        assert!(table::contains(proposals, proposal_id), error::not_found(EPRPOSAL_ID_NOT_EXIST));
        *table::borrow(proposals, proposal_id)
    }

    #[view]
    /// Get the proposal resolution result
    public fun get_proposal_resolution(proposal_id: u64, nft_dao: address): u8 acquires Proposals {
        let proposal = get_proposal(proposal_id, nft_dao);
        proposal.resolution
    }

    #[view]
    /// Unpack the DAO fields
    public fun unpack_dao(
        nft_dao: address
    ): (String, u64, address, String, u64, u64, u64, address, Option<address>) acquires DAO {
        let dao = borrow_global<DAO>(nft_dao);
        (
            dao.name,
            dao.resolve_threshold,
            dao.governance_token.creator,
            dao.governance_token.collection,
            dao.voting_duration,
            dao.min_required_proposer_voting_power,
            dao.next_proposal_id,
            dao.admin,
            dao.pending_admin,
        )
    }

    #[view]
    public fun view_votes(nft_dao: address, proposal_id: u64): (u64, u64) acquires ProposalVotingStatistics {
        let resp = borrow_global<ProposalVotingStatistics>(nft_dao);
        let pr = &resp.proposals;
        let vs = table::borrow(pr, proposal_id);

        return (vs.total_yes, vs.total_no)
    }

    /////////////////////////// DAO flow //////////////////////////////////
    /// Creator creates a DAO on the platform
    public entry fun create_dao(
        admin: &signer,
        name: String,
        threshold: u64,
        voting_duration: u64,
        voting_token_collection_creator: address, // this is the creator address of goverance token
        collection_name: String,
        min_required_proposer_voting_power: u64,
    ) {
        create_dao_and_get_dao_address(
            admin,
            name,
            threshold,
            voting_duration,
            voting_token_collection_creator,
            collection_name,
            min_required_proposer_voting_power
        );
    }

    /// Creator creates a DAO on the platform
    public fun create_dao_and_get_dao_address(
        admin: &signer,
        name: String,
        threshold: u64,
        voting_duration: u64,
        voting_token_collection_creator: address,
        collection_name: String,
        min_required_proposer_voting_power: u64,
    ): address {
        // create a resource account
        let seed = bcs::to_bytes(&name);
        vector::append(&mut seed, bcs::to_bytes(&voting_token_collection_creator));
        vector::append(&mut seed, bcs::to_bytes(&collection_name));

        let (res_signer, res_cap) = account::create_resource_account(admin, seed);
        let src_addr = signer::address_of(admin);

        // register aptos coin
        coin::register<AptosCoin>(&res_signer);
        // initalize token store and opt-in direct NFT transfer for easy of operation
        token::initialize_token_store(&res_signer);
        token::opt_in_direct_transfer(&res_signer, true);

        assert!(string::length(&name) < 128, error::invalid_argument(ESTRING_TOO_LONG));

        move_to(
            &res_signer,
            DAO {
                name,
                resolve_threshold: threshold,
                governance_token: GovernanceToken { creator: voting_token_collection_creator, collection: collection_name },
                voting_duration,
                min_required_proposer_voting_power,
                next_proposal_id: 0,
                dao_signer_capability: res_cap,
                admin: src_addr,
                pending_admin: option::none(),
            },
        );
        move_to(
            &res_signer,
            Proposals {
                proposals: table::new(),
            }
        );

        move_to(
            &res_signer,
            ProposalVotingStatistics {
                proposals: table::new()
            }
        );

        let dao_addr = signer::address_of(&res_signer);

        emit_create_dao_event(
            &res_signer,
            name,
            threshold,
            voting_duration,
            min_required_proposer_voting_power,
            voting_token_collection_creator,
            collection_name,
            src_addr,
        );
        dao_addr
    }

    /// Only DAO Goverance token holders can create proposal
    public entry fun create_proposal(
        account: &signer,
        nft_dao: address, // resource account address of the nft dao
        name: String, // name of the proposal
        description: String, // description of the proposal
        start_time_sec: u64, // when the voting starts
        proposal_type: u64,
        song_id: u64,
        artist: address,
    ) acquires DAO, Proposals {
        assert!(proposal_type >= 0 && proposal_type <= 2, error::invalid_argument(INVALID_PROPOSAL_ID));
        if (proposal_type == 0) {
            assert!(song_id == 0, error::invalid_argument(INVALID_SONG_ID));
            assert!(artist == @0x0, error::invalid_argument(INVALID_ARTIST_ADDRESS));
        } else if (proposal_type == 1) {
            assert!(artist == @0x0, error::invalid_argument(INVALID_ARTIST_ADDRESS));
            let exists = is_song_exists(song_id);
            assert!(exists, error::not_found(SONG_NOT_FOUND));
        } else if (proposal_type == 2) {
            assert!(song_id == 0, error::invalid_argument(SONG_NOT_FOUND));
            let exists = is_artist_exist(artist);
            assert!(exists, error::not_found(ARTIST_NOT_FOUND));
        } else {
            error::invalid_argument(INVALID_PROPOSAL_ID);
        };
        let dao = borrow_global_mut<DAO>(@sender);
        assert!(string::length(&name) <= 64, error::invalid_argument(ESTRING_TOO_LONG));
        assert!(string::length(&description) <= 512, error::invalid_argument(ESTRING_TOO_LONG));
        let admin_addr = signer::address_of(account);

        if (admin_addr != dao.admin) {
            let sum = fetch_entry(signer::address_of(account));
            assert!(
                sum >= 1000000000,
                error::permission_denied(ESTAKES_NOT_ENOUGH)
            );
        };
        let now = timestamp::now_seconds();
        assert!(start_time_sec > now, error::invalid_argument(EPROPOSAL_START_TIME_SHOULD_BE_IN_FUTURE));

        let proposal = Proposal {
            name,
            description,
            song_id,
            proposal_type,
            artist_address: artist,
            start_time_sec,
            resolution: PROPOSAL_PENDING,
            final_yes_votes: 0,
            final_no_votes: 0,
        };

        let proposal_store = borrow_global_mut<Proposals>(@sender);
        let proposal_id = dao.next_proposal_id + 1;
        table::upsert(&mut proposal_store.proposals, proposal_id, proposal);
        dao.next_proposal_id = proposal_id;
        nft_dao_events::emit_create_proposal_event(
            admin_addr,
            nft_dao,
            proposal_id,
            name,
            description,
            start_time_sec,
        );
    }
    public entry fun create_proposal2(
        account: &signer,
        nft_dao: address, // resource account address of the nft dao
        name: String, // name of the proposal
        description: String, // description of the proposal
        start_time_sec: u64, // when the voting starts
        proposal_type: u64,
        song_id: u64,
        artist: address,
    ) acquires DAO, Proposals {
        assert!(proposal_type >= 0 && proposal_type <= 2, error::invalid_argument(INVALID_PROPOSAL_ID));
        if (proposal_type == 0) {
            assert!(song_id == 0, error::invalid_argument(INVALID_SONG_ID));
            assert!(artist == @0x0, error::invalid_argument(INVALID_ARTIST_ADDRESS));
        } else if (proposal_type == 1) {
            assert!(artist == @0x0, error::invalid_argument(INVALID_ARTIST_ADDRESS));
            let exists = is_song_exists(song_id);
            assert!(exists, error::not_found(SONG_NOT_FOUND));
        } else if (proposal_type == 2) {
            assert!(song_id == 0, error::invalid_argument(SONG_NOT_FOUND));
            let exists = is_artist_exist(artist);
            assert!(exists, error::not_found(ARTIST_NOT_FOUND));
        } else {
            error::invalid_argument(INVALID_PROPOSAL_ID);
        };
        let dao = borrow_global_mut<DAO>(nft_dao);
        assert!(string::length(&name) <= 64, error::invalid_argument(ESTRING_TOO_LONG));
        assert!(string::length(&description) <= 512, error::invalid_argument(ESTRING_TOO_LONG));
        let admin_addr = signer::address_of(account);

        if (admin_addr != dao.admin) {
            let sum = fetch_entry(signer::address_of(account));
            assert!(
                sum >= 1000000000,
                error::permission_denied(ESTAKES_NOT_ENOUGH)
            );
        };
        let now = timestamp::now_seconds();
        assert!(start_time_sec > now, error::invalid_argument(EPROPOSAL_START_TIME_SHOULD_BE_IN_FUTURE));

        let proposal = Proposal {
            name,
            description,
            song_id,
            proposal_type,
            artist_address: artist,
            start_time_sec,
            resolution: PROPOSAL_PENDING,
            final_yes_votes: 0,
            final_no_votes: 0,
        };

        let proposal_store = borrow_global_mut<Proposals>(nft_dao);
        let proposal_id = dao.next_proposal_id + 1;
        table::upsert(&mut proposal_store.proposals, proposal_id, proposal);
        dao.next_proposal_id = proposal_id;
        nft_dao_events::emit_create_proposal_event(
            admin_addr,
            nft_dao,
            proposal_id,
            name,
            description,
            start_time_sec,
        );
    }

    /// Vote with a batch of tokens
    public entry fun vote(
        account: &signer,
        nft_dao: address,
        proposal_id: u64,
        vote: bool,
        token_names: vector<String>,
        property_versions: vector<u64>,
    ) acquires DAO, ProposalVotingStatistics, Proposals {
        assert!(
            vector::length(&token_names) == vector::length(&property_versions),
            error::invalid_argument(ETOKEN_NAME_COUNT_NOT_MATCH_PROPERTY_VERSION_COUNT)
        );
        assert!(exists<DAO>(nft_dao), error::not_found(EDAO_NOT_EXIST));
        let dao = borrow_global_mut<DAO>(@sender);
        let gtoken = &dao.governance_token;
        let proposals = borrow_global<Proposals>(nft_dao);

        // assert the proposal hasn't ended, voter can can only vote for the proposal that starts and hasn't ended
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&proposals.proposals, proposal_id);
        let now = timestamp::now_seconds();
        assert!(now < proposal.start_time_sec + dao.voting_duration, error::invalid_argument(EPROPOSAL_ENDED));
        assert!(now > proposal.start_time_sec, error::invalid_argument(EPROPOSAL_NOT_STARTED));

        let prop_stats = borrow_global_mut<ProposalVotingStatistics>(@sender);

        // initialize the voting statistics of the proposal
        if (!table::contains(&prop_stats.proposals, proposal_id)) {
            let vstat = VotingStatistics {
                total_yes: 0,
                total_no: 0,
                yes_votes: bucket_table::new(10),
                no_votes: bucket_table::new(10),
            };
            table::add(&mut prop_stats.proposals, proposal_id, vstat);
        };
        let stats = table::borrow_mut(&mut prop_stats.proposals, proposal_id);

        let voter_addr = signer::address_of(account);
        // loop through all NFTs used for voting and update the voting result
        vector::enumerate_ref(&token_names, |i, token_name| {
            let token_name = *token_name;
            let property_version = *vector::borrow(&property_versions, i);
            let token_id = token::create_token_id_raw(gtoken.creator, gtoken.collection, token_name, property_version);
            // check if this token already voted
            assert!(!bucket_table::contains(&stats.no_votes, &token_id), error::invalid_argument(ETOKEN_ALREADY_VOTED));
            assert!(
                !bucket_table::contains(&stats.yes_votes, &token_id),
                error::invalid_argument(ETOKEN_ALREADY_VOTED)
            );

            // this account owns the token
            assert!(
                token::balance_of(signer::address_of(account), token_id) == 1,
                error::permission_denied(ENOT_OWN_THE_VOTING_DAO_TOKEN)
            );
            if (vote) {
                stats.total_yes = stats.total_yes + 1;
                bucket_table::add(&mut stats.yes_votes, token_id, voter_addr);
            } else {
                stats.total_no = stats.total_no + 1;
                bucket_table::add(&mut stats.no_votes, token_id, voter_addr);
            };
        });

        nft_dao_events::emit_voting_event(
            voter_addr,
            nft_dao,
            proposal_id,
            vote,
            token_names,
            property_versions,
        );
    }
    public entry fun vote2(
        account: &signer,
        nft_dao: address,
        proposal_id: u64,
        vote: bool,
        token_names: vector<String>,
        property_versions: vector<u64>,
    ) acquires DAO, ProposalVotingStatistics, Proposals {
        assert!(
            vector::length(&token_names) == vector::length(&property_versions),
            error::invalid_argument(ETOKEN_NAME_COUNT_NOT_MATCH_PROPERTY_VERSION_COUNT)
        );
        assert!(exists<DAO>(nft_dao), error::not_found(EDAO_NOT_EXIST));
        let dao = borrow_global_mut<DAO>(nft_dao);
        let gtoken = &dao.governance_token;
        let proposals = borrow_global<Proposals>(nft_dao);

        // assert the proposal hasn't ended, voter can can only vote for the proposal that starts and hasn't ended
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&proposals.proposals, proposal_id);
        let now = timestamp::now_seconds();
        assert!(now < proposal.start_time_sec + dao.voting_duration, error::invalid_argument(EPROPOSAL_ENDED));
        assert!(now > proposal.start_time_sec, error::invalid_argument(EPROPOSAL_NOT_STARTED));

        let prop_stats = borrow_global_mut<ProposalVotingStatistics>(nft_dao);

        // initialize the voting statistics of the proposal
        if (!table::contains(&prop_stats.proposals, proposal_id)) {
            let vstat = VotingStatistics {
                total_yes: 0,
                total_no: 0,
                yes_votes: bucket_table::new(10),
                no_votes: bucket_table::new(10),
            };
            table::add(&mut prop_stats.proposals, proposal_id, vstat);
        };
        let stats = table::borrow_mut(&mut prop_stats.proposals, proposal_id);

        let voter_addr = signer::address_of(account);
        // loop through all NFTs used for voting and update the voting result
        vector::enumerate_ref(&token_names, |i, token_name| {
            let token_name = *token_name;
            let property_version = *vector::borrow(&property_versions, i);
            let token_id = token::create_token_id_raw(gtoken.creator, gtoken.collection, token_name, property_version);
            // check if this token already voted
            assert!(!bucket_table::contains(&stats.no_votes, &token_id), error::invalid_argument(ETOKEN_ALREADY_VOTED));
            assert!(
                !bucket_table::contains(&stats.yes_votes, &token_id),
                error::invalid_argument(ETOKEN_ALREADY_VOTED)
            );

            // this account owns the token
            assert!(
                token::balance_of(signer::address_of(account), token_id) == 1,
                error::permission_denied(ENOT_OWN_THE_VOTING_DAO_TOKEN)
            );
            if (vote) {
                stats.total_yes = stats.total_yes + 1;
                bucket_table::add(&mut stats.yes_votes, token_id, voter_addr);
            } else {
                stats.total_no = stats.total_no + 1;
                bucket_table::add(&mut stats.no_votes, token_id, voter_addr);
            };
        });

        nft_dao_events::emit_voting_event(
            voter_addr,
            nft_dao,
            proposal_id,
            vote,
            token_names,
            property_versions,
        );
    }

    /// Anyone can call the resolve function to resolve a proposal.
    public entry fun resolve(proposal_id: u64, nft_dao: address) acquires Proposals, DAO, ProposalVotingStatistics {
        assert!(exists<DAO>(nft_dao), error::not_found(EDAO_NOT_EXIST));
        let dao = borrow_global<DAO>(nft_dao);
        // assert the proposal voting ended
        let proposals = borrow_global<Proposals>(nft_dao);
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&proposals.proposals, proposal_id);
        let now = timestamp::now_seconds();
        assert!(now >= proposal.start_time_sec + dao.voting_duration, error::invalid_argument(EPROPOSAL_NOT_END));
        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(EPROPOSAL_RESOLVED));
        resolve_internal(option::none(), proposal_id, nft_dao);
    }
    public entry fun resolve2(proposal_id: u64, nft_dao: address) acquires Proposals, DAO, ProposalVotingStatistics {
        assert!(exists<DAO>(nft_dao), error::not_found(EDAO_NOT_EXIST));
        let dao = borrow_global<DAO>(nft_dao);
        // assert the proposal voting ended
        let proposals = borrow_global<Proposals>(nft_dao);
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&proposals.proposals, proposal_id);
        let now = timestamp::now_seconds();
        assert!(now >= proposal.start_time_sec + dao.voting_duration, error::invalid_argument(EPROPOSAL_NOT_END));
        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(EPROPOSAL_RESOLVED));
        resolve_internal2(option::none(), proposal_id, nft_dao);
    }

    /////////////////////////// Admin flow //////////////////////////////////

    /// Admin can veto an active proposal
    public entry fun admin_veto_proposal(
        admin: &signer,
        proposal_id: u64,
        nft_dao: address,
        reason: String
    ) acquires DAO, Proposals {
        assert!(exists<DAO>(nft_dao), error::not_found(EDAO_NOT_EXIST));
        let dao = borrow_global_mut<DAO>(@sender);
        assert!(dao.admin == signer::address_of(admin), error::permission_denied(EINVALID_ADMIN_ACCOUNT));
        // assert the proposal is still active
        let proposals = borrow_global_mut<Proposals>(@sender);
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow_mut(&mut proposals.proposals, proposal_id);
        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(EPROPOSAL_RESOLVED));
        proposal.resolution = PROPOSAL_VETOED_BY_ADMIN;

        nft_dao_events::emit_admin_veto_event(
            proposal_id,
            signer::address_of(admin),
            nft_dao,
            reason,
        )
    }
    public entry fun admin_veto_proposal2(
        admin: &signer,
        proposal_id: u64,
        nft_dao: address,
        reason: String
    ) acquires DAO, Proposals {
        assert!(exists<DAO>(nft_dao), error::not_found(EDAO_NOT_EXIST));
        let dao = borrow_global_mut<DAO>(nft_dao);
        assert!(dao.admin == signer::address_of(admin), error::permission_denied(EINVALID_ADMIN_ACCOUNT));
        // assert the proposal is still active
        let proposals = borrow_global_mut<Proposals>(nft_dao);
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow_mut(&mut proposals.proposals, proposal_id);
        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(EPROPOSAL_RESOLVED));
        proposal.resolution = PROPOSAL_VETOED_BY_ADMIN;

        nft_dao_events::emit_admin_veto_event(
            proposal_id,
            signer::address_of(admin),
            nft_dao,
            reason,
        )
    }

    /// DAO admin can directly resolve a proposal
    public entry fun admin_resolve(
        admin: &signer,
        proposal_id: u64,
        nft_dao: address,
        reason: String
    ) acquires DAO, Proposals, ProposalVotingStatistics {
        let resolver = signer::address_of(admin);
        // assert the proposal voting ended
        let proposals = borrow_global<Proposals>(nft_dao);
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&proposals.proposals, proposal_id);
        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(EPROPOSAL_RESOLVED));
        resolve_internal(option::some(resolver), proposal_id, nft_dao);

        nft_dao_events::emit_admin_resolve_event(
            proposal_id,
            signer::address_of(admin),
            nft_dao,
            reason,
        )
    }
    public entry fun admin_resolve2(
        admin: &signer,
        proposal_id: u64,
        nft_dao: address,
        reason: String
    ) acquires DAO, Proposals, ProposalVotingStatistics {
        let resolver = signer::address_of(admin);
        // assert the proposal voting ended
        let proposals = borrow_global<Proposals>(nft_dao);
        assert!(table::contains(&proposals.proposals, proposal_id), error::not_found(EPROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&proposals.proposals, proposal_id);
        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(EPROPOSAL_RESOLVED));
        resolve_internal2(option::some(resolver), proposal_id, nft_dao);

        nft_dao_events::emit_admin_resolve_event(
            proposal_id,
            signer::address_of(admin),
            nft_dao,
            reason,
        )
    }

    /// Offer admin of a DAO to an new admin. The new admin can then claim the offer to be the new admin of the DAO.
    public entry fun offer_admin(admin: &signer, dao: address, new_admin: address) acquires DAO {
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let admin_addr = signer::address_of(admin);
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(admin_addr == dao_config.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));

        assert!(option::is_none(&dao_config.pending_admin), error::invalid_argument(EADMIN_ALREADY_OFFERED));
        option::fill(&mut dao_config.pending_admin, new_admin);
        nft_dao_events::emit_admin_offer_event(admin_addr, new_admin, dao);
    }

    /// Cancel the admin offer
    public entry fun cancel_admin_offer(admin: &signer, dao: address) acquires DAO {
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let admin_addr = signer::address_of(admin);
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(admin_addr == dao_config.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));
        // DAO offer exists
        assert!(option::is_some(&dao_config.pending_admin), error::invalid_argument(EADMIN_OFFER_NOT_EXIST));
        option::extract(&mut dao_config.pending_admin);
        nft_dao_events::emit_admin_offer_cancel_event(admin_addr, dao);
    }

    /// Claim DAO's admin from an offer. The new_admin will become the admin of the DAO.
    public entry fun claim_admin(account: &signer, dao: address) acquires DAO {
        // DAO offer exists
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(option::is_some(&dao_config.pending_admin), error::invalid_argument(EADMIN_OFFER_NOT_EXIST));

        // Allow setting the admin to 0x0.
        let new_admin = option::extract(&mut dao_config.pending_admin);
        let old_admin = dao_config.admin;
        let caller_address = signer::address_of(account);
        if (new_admin == @0x0) {
            // If the admin is being updated to 0x0, for security reasons, this finalization must only be done by the
            // current admin.
            assert!(old_admin == caller_address, error::permission_denied(EINVALID_ADMIN_ACCOUNT));
        } else {
            // Otherwise, only the new admin can finalize the transfer.
            assert!(new_admin == caller_address, error::not_found(EADMIN_OFFER_NOT_EXIST));
        };

        // update the DAO's admin address
        dao_config.admin = new_admin;
        nft_dao_events::emit_admin_claim_event(old_admin, new_admin, dao);
    }

    /// Admin disable the DAO admin through setting the admin to 0x0
    public entry fun disable_admin(admin: &signer, dao: address) acquires DAO {
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let admin_addr = signer::address_of(admin);
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(admin_addr == dao_config.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));

        // make sure no one can be admin of the DAO
        dao_config.admin = @0x0;
    }

    /// Convenient batch update function for the admin to udpate multiple fields in the DAO.
    public entry fun admin_update_dao(
        admin: &signer,
        dao: address,
        name: String,
        voting_threshold: u64,
        voting_duration: u64,
        min_proposer_voting_power: u64,
    ) acquires DAO {
        admin_change_dao_name(admin, dao, name);
        admin_change_dao_threshold(admin, dao, voting_threshold);
        admin_change_dao_voting_duration(admin, dao, voting_duration);
        admin_change_dao_min_voting_power(admin, dao, min_proposer_voting_power);
    }

    /// Allow the admin to update the DAO's name.
    public entry fun admin_change_dao_name(admin: &signer, dao: address, new_name: String) acquires DAO {
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        assert!(string::length(&new_name) < 128, error::invalid_argument(ESTRING_TOO_LONG));
        let admin_addr = signer::address_of(admin);
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(admin_addr == dao_config.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));

        // update the dao name to a new name
        let old_name = dao_config.name;
        dao_config.name = new_name;
        nft_dao_events::emit_change_name_event(old_name, new_name, dao);
    }

    /// Allow the admin to update the DAO's voting threshold (the min votes required for a proposal to be resolvable).
    public entry fun admin_change_dao_threshold(admin: &signer, dao: address, new_threshold: u64) acquires DAO {
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let admin_addr = signer::address_of(admin);
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(admin_addr == dao_config.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));

        let old_threshold = dao_config.resolve_threshold;
        dao_config.resolve_threshold = new_threshold;
        nft_dao_events::emit_change_threshold_event(old_threshold, new_threshold, dao);
    }

    /// Allow the admin to update the DAO's voting duration.
    public entry fun admin_change_dao_voting_duration(admin: &signer, dao: address, new_duration: u64) acquires DAO {
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let admin_addr = signer::address_of(admin);
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(admin_addr == dao_config.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));

        // update the dao name to a new name
        let old_duration = dao_config.voting_duration;
        dao_config.voting_duration = new_duration;
        nft_dao_events::emit_change_duration_event(old_duration, new_duration, dao);
    }

    /// Allow the admin to update the DAO's min required voting power to create proposals.
    public entry fun admin_change_dao_min_voting_power(admin: &signer, dao: address, new_power: u64) acquires DAO {
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let admin_addr = signer::address_of(admin);
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(admin_addr == dao_config.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));

        // update the dao name to a new name
        let old_power = dao_config.min_required_proposer_voting_power;
        dao_config.min_required_proposer_voting_power = new_power;
        nft_dao_events::emit_change_voting_power_event(old_power, new_power, dao);
    }

    /// DAO creator can quit the platform and claim back his resource account signer capability
    public fun destroy_dao_and_reclaim_signer_capability(
        account: &signer,
        dao: address
    ): SignerCapability acquires DAO {
        let addr = signer::address_of(account);
        assert!(exists<DAO>(dao), error::not_found(EDAO_NOT_EXIST));
        let dao_config = borrow_global_mut<DAO>(dao);
        assert!(dao_config.admin == addr, error::permission_denied(EINVALID_ADMIN_ACCOUNT));
        let DAO {
            name: _,
            resolve_threshold: _,
            governance_token: _,
            voting_duration: _,
            min_required_proposer_voting_power: _,
            next_proposal_id: _,
            dao_signer_capability,
            admin: _,
            pending_admin: _
        } = move_from<DAO>(dao);
        dao_signer_capability
    }

    /// Unpack the proposal fields
    public fun unpack_proposal(proposal: &Proposal): (String, String, u64, u8, u64) {
        (
            proposal.name,
            proposal.description,
            proposal.start_time_sec,
            proposal.resolution,
            proposal.proposal_type
        )
    }

    /////////////////////////// Private functions //////////////////////////////////
    /// Transfer coin from the DAO account to the destination account
    fun transfer_fund(res_acct: &signer, dst: address, amount: u64) {
        coin::transfer<AptosCoin>(res_acct, dst, amount);
    }

    /// offer one NFT from DAO to the DST address. The DST address should
    fun offer_nft(
        res_acct: &signer,
        creator: address,
        collection: String,
        token_name: String,
        property_version: u64,
        dst: address
    ) {
        let token_id = create_token_id_raw(creator, collection, token_name, property_version);
        token_transfers::offer(res_acct, dst, token_id, 1);
    }

    /// Internal function for executing a DAO's proposal
    fun execute_proposal(proposal: &Proposal, _dao: &DAO) {
        if (proposal.proposal_type == 1) {
            let song_id = proposal.song_id;
            resolve_delete_song(song_id);
        } else if (proposal.proposal_type == 2) {
            let artist = proposal.artist_address;
            resolve_delete_artist(artist);
        } else {
            assert!(proposal.proposal_type == 0, error::invalid_argument(ENOT_SUPPROTED_FUNCTION));
        }
    }

    /// Resolve an proposal
    fun resolve_internal(
        resolver: Option<address>,
        proposal_id: u64,
        nft_dao: address
    ) acquires DAO, Proposals, ProposalVotingStatistics {
        // validate if proposal is ready to resolve
        let dao = borrow_global_mut<DAO>(@sender);
        // assert the proposal voting ended
        let proposals = borrow_global_mut<Proposals>(@sender);
        let proposal = table::borrow_mut(&mut proposals.proposals, proposal_id);

        if (option::is_some(&resolver)) {
            // only DAO admin can execute the proposal directly
            assert!(*option::borrow(&resolver) == dao.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));
            execute_proposal(proposal, dao);
            proposal.resolution = PROPOSAL_RESOLVED_BY_ADMIN;
            // return early befor emitting the normal resolve event.
            return
        };

        assert!(exists<ProposalVotingStatistics>(nft_dao), error::not_found(EVOTING_STATISTICS_NOT_FOUND));
        let proposal_stat = &mut borrow_global_mut<ProposalVotingStatistics>(@sender).proposals;
        let voting_stat = table::borrow_mut(proposal_stat, proposal_id);
        proposal.final_yes_votes = voting_stat.total_yes;
        proposal.final_no_votes = voting_stat.total_no;
        // validate resolve threshold and result
        let voted = voting_stat.total_no + voting_stat.total_yes;
        if (voted < dao.resolve_threshold) {
            // not sufficient token voted
            proposal.resolution = PROPOSAL_RESOLVED_NOT_PASSED;
        } else if (voting_stat.total_yes > voting_stat.total_no) {
            execute_proposal(proposal, dao);
            proposal.resolution = PROPOSAL_RESOLVED_PASSED;
        } else {
            proposal.resolution = PROPOSAL_RESOLVED_NOT_PASSED;
        };

        nft_dao_events::emit_resolve_event(
            proposal_id,
            nft_dao,
            proposal.resolution,
        )
    }
    fun resolve_internal2(
        resolver: Option<address>,
        proposal_id: u64,
        nft_dao: address
    ) acquires DAO, Proposals, ProposalVotingStatistics {
        // validate if proposal is ready to resolve
        let dao = borrow_global_mut<DAO>(nft_dao);
        // assert the proposal voting ended
        let proposals = borrow_global_mut<Proposals>(nft_dao);
        let proposal = table::borrow_mut(&mut proposals.proposals, proposal_id);

        if (option::is_some(&resolver)) {
            // only DAO admin can execute the proposal directly
            assert!(*option::borrow(&resolver) == dao.admin, error::permission_denied(EINVALID_ADMIN_ACCOUNT));
            execute_proposal(proposal, dao);
            proposal.resolution = PROPOSAL_RESOLVED_BY_ADMIN;
            // return early befor emitting the normal resolve event.
            return
        };

        assert!(exists<ProposalVotingStatistics>(nft_dao), error::not_found(EVOTING_STATISTICS_NOT_FOUND));
        let proposal_stat = &mut borrow_global_mut<ProposalVotingStatistics>(nft_dao).proposals;
        let voting_stat = table::borrow_mut(proposal_stat, proposal_id);
        proposal.final_yes_votes = voting_stat.total_yes;
        proposal.final_no_votes = voting_stat.total_no;
        // validate resolve threshold and result
        let voted = voting_stat.total_no + voting_stat.total_yes;
        if (voted < dao.resolve_threshold) {
            // not sufficient token voted
            proposal.resolution = PROPOSAL_RESOLVED_NOT_PASSED;
        } else if (voting_stat.total_yes > voting_stat.total_no) {
            execute_proposal(proposal, dao);
            proposal.resolution = PROPOSAL_RESOLVED_PASSED;
        } else {
            proposal.resolution = PROPOSAL_RESOLVED_NOT_PASSED;
        };

        nft_dao_events::emit_resolve_event(
            proposal_id,
            nft_dao,
            proposal.resolution,
        )
    }

    fun get_proposal_weights(
        account: &signer,
        token_names: &vector<String>,
        property_versions: &vector<u64>,
        dao: &DAO
    ): u64 {
        let gtoken = &dao.governance_token;
        let used_token_ids = vector::empty();
        let total = vector::length(token_names);
        vector::enumerate_ref(token_names, |i, token_name| {
            let token_name = *token_name;
            let property_version = *vector::borrow(property_versions, i);
            let token_id = token::create_token_id_raw(gtoken.creator, gtoken.collection, token_name, property_version);
            assert!(
                !vector::contains(&used_token_ids, &token_id),
                error::already_exists(ETOKEN_USED_FOR_CREATING_PROPOSAL)
            );
            vector::push_back(&mut used_token_ids, token_id);
            assert!(
                token::balance_of(signer::address_of(account), token_id) == 1,
                error::permission_denied(ENOT_OWN_THE_VOTING_DAO_TOKEN)
            );
        });
        total
    }

    fun assert_function_valid(function_name: String, map: &PropertyMap) {
        if (function_name == string::utf8(b"transfer_fund")) {
            assert!(property_map::length(map) == 2, error::invalid_argument(ENOT_SUPPROTED_FUNCTION));
            property_map::read_address(map, &string::utf8(b"dst"));
            property_map::read_u64(map, &string::utf8(b"amount"));
        } else if (function_name == string::utf8(b"no_op")) {
            assert!(property_map::length(map) == 0, error::invalid_argument(ENOT_SUPPROTED_FUNCTION));
        } else if (function_name == string::utf8(b"offer_nft")) {
            assert!(property_map::length(map) == 5, error::invalid_argument(ENOT_SUPPROTED_FUNCTION));
            property_map::read_address(map, &string::utf8(b"creator"));
            property_map::read_string(map, &string::utf8(b"collection"));
            property_map::read_string(map, &string::utf8(b"token_name"));
            property_map::read_u64(map, &string::utf8(b"property_version"));
            property_map::read_address(map, &string::utf8(b"dst"));
        } else {
            abort error::invalid_argument(ENOT_SUPPROTED_FUNCTION)
        }
    }
}