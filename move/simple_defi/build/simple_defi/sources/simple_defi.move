/// This module demonstrates how to create a new coin and build simple defi swap functions for the new coin
/// using a resource account.
///
/// - Initialization of this module
/// Let's say we have an original account at address `0xcafe`. We can use it to call
/// `create_resource_account_and_publish_package(origin, vector::empty<>(), ...)` - this will create a resource account at
/// address `0xc3bb8488ab1a5815a9d543d7e41b0e0df46a7396f89b22821f07a4362f75ddc5`. The module `simple_defi` will be published
/// under the resource account's address.
///
/// - The basic flow
/// (1) call create_resource_account_and_publish_package() to publish this module under the resource account's address.
/// init_module() will be called with resource account's signer as part of publishing the package.
/// - In init_module(), we do two things: first, we create the new coin; secondly, we store the resource account's signer capability
/// and the coin's mint and burn capabilities within `ModuleData`. Storing the signer capability allows the module to programmatically
/// sign transactions without needing a private key
/// (2) when exchanging coins, we call `exchange_to` to swap `AptosCoin` to `Team22Coin`, and `exchange_from` to swap `AptosCoin` from `Team22Coin`
module resource_account::simple_defi {
    use std::signer;
    use std::string;
    use std::string::String;
    use std::vector;

    use aptos_framework::account;
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability};
    use aptos_framework::resource_account;
    use aptos_token::token::TokenDataId;
    use aptos_framework::aptos_coin::{AptosCoin};
    use aptos_token::token;

    struct ModuleData has key {
        resource_signer_cap: account::SignerCapability,
        burn_cap: BurnCapability<Team22Coin>,
        mint_cap: MintCapability<Team22Coin>,
        token_data_id: TokenDataId
    }

    struct Team22Coin {
        aptos_coin: AptosCoin
    }

    /// initialize the module and store the signer cap, mint cap and burn cap within `ModuleData`
    fun init_module(resource_signer: &signer) {
        // store the capabilities within `ModuleData`
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(resource_signer, @source_addr);
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<Team22Coin>(
            resource_signer,
            string::utf8(b"Team22's Coin"),
            string::utf8(b"T22"),
            8,
            false,
        );


        let collection_name = string::utf8(b"T22 Membership");
        let description = string::utf8(b"Description");
        let collection_uri = string::utf8(b"Collection uri");
        let token_name = string::utf8(b"T22 NFT Pass");
        let token_uri = string::utf8(b"Token uri");
        // This means that the supply of the token will not be tracked.
        let maximum_supply = 0;
        // This variable sets if we want to allow mutation for collection description, uri, and maximum.
        // Here, we are setting all of them to false, which means that we don't allow mutations to any CollectionData fields.
        let mutate_setting = vector<bool>[ false, false, false ];

        // Create the nft collection.
        token::create_collection(resource_signer, collection_name, description, collection_uri, maximum_supply, mutate_setting);

        // Create a token data id to specify the token to be minted.
        let token_data_id = token::create_tokendata(
            resource_signer,
            collection_name,
            token_name,
            string::utf8(b""),
            0,
            token_uri,
            signer::address_of(resource_signer),
            1,
            0,
            // This variable sets if we want to allow mutation for token maximum, uri, royalty, description, and properties.
            // Here we enable mutation for properties by setting the last boolean in the vector to true.
            token::create_token_mutability_config(
                &vector<bool>[ false, false, false, false, true ]
            ),
            // We can use property maps to record attributes related to the token.
            // In this example, we are using it to record the receiver's address.
            // We will mutate this field to record the user's address
            // when a user successfully mints a token in the `mint_event_ticket()` function.
            vector<String>[string::utf8(b"given_to")],
            vector<vector<u8>>[b""],
            vector<String>[ string::utf8(b"address") ],
        );

        // Retrieve the resource signer's signer capability and store it within the `ModuleData`.
        // Note that by calling `resource_account::retrieve_resource_account_cap` to retrieve the resource account's signer capability,
        // we rotate th resource account's authentication key to 0 and give up our control over the resource account. Before calling this function,
        // the resource account has the same authentication key as the source account so we had control over the resource account.

        // Store the token data id and the resource account's signer capability within the module, so we can programmatically
        // sign for transactions in the `mint_event_ticket()` function.



        move_to(resource_signer, ModuleData {
            resource_signer_cap,
            burn_cap,
            mint_cap,
            token_data_id
        });

        // destroy freeze cap because we aren't using it
        coin::destroy_freeze_cap(freeze_cap);

        // regsiter the resource account with both coins so it has a CoinStore to store those coins
        coin::register<AptosCoin>(resource_signer);
        coin::register<Team22Coin>(resource_signer);
    }

    /// Exchange AptosCoin to Team22Coin
    public fun exchange_to(a_coin: Coin<AptosCoin>): Coin<Team22Coin> acquires ModuleData {
        let coin_cap = borrow_global_mut<ModuleData>(@resource_account);
        let amount = coin::value(&a_coin);
        coin::deposit(@resource_account, a_coin);
        coin::mint<Team22Coin>(amount, &coin_cap.mint_cap)
    }

    /// Exchange Team22Coin to AptosCoin
    public fun exchange_from(c_coin: Coin<Team22Coin>): Coin<AptosCoin> acquires ModuleData {
        let amount = coin::value(&c_coin);
        let coin_cap = borrow_global_mut<ModuleData>(@resource_account);
        coin::burn<Team22Coin>(c_coin, &coin_cap.burn_cap);

        let module_data = borrow_global_mut<ModuleData>(@resource_account);
        let resource_signer = account::create_signer_with_capability(&module_data.resource_signer_cap);
        coin::withdraw<AptosCoin>(&resource_signer, amount)
    }

    /// Entry function version of exchange_to() for e2e tests only
    public entry fun exchange_to_entry(account: &signer, amount: u64) acquires ModuleData {
        let a_coin = coin::withdraw<AptosCoin>(account, amount);
        let c_coin = exchange_to(a_coin);

        coin::register<Team22Coin>(account);
        coin::deposit(signer::address_of(account), c_coin);
    }

    /// Entry function version of exchange_from() for e2e tests only
    public entry fun exchange_from_entry(account: &signer, amount: u64) acquires ModuleData {
        let c_coin = coin::withdraw<Team22Coin>(account, amount);
        let a_coin = exchange_from(c_coin);

        coin::deposit(signer::address_of(account), a_coin);
    }

    public fun initial_registration(account: &signer) {
        coin::register<Team22Coin>(account);
    }

    public entry fun custom_to_custom(to: address, amount: u64) acquires ModuleData {
        let module_data = borrow_global_mut<ModuleData>(@resource_account);
        let resource_signer = account::create_signer_with_capability(&module_data.resource_signer_cap);
        coin::transfer<Team22Coin>(&resource_signer, to, amount);
    }

    public entry fun exchange_to_entry_resource(account: &signer, amount: u64) acquires ModuleData {
        let a_coin = coin::withdraw<AptosCoin>(account, amount);
        let c_coin = exchange_to(a_coin);

        let module_data = borrow_global_mut<ModuleData>(@resource_account);
        let resource_signer = account::create_signer_with_capability(&module_data.resource_signer_cap);

        coin::register<Team22Coin>(&resource_signer);
        coin::deposit(signer::address_of(&resource_signer), c_coin);
    }

    public fun exchange_from_entry_resource(account: &signer, amount: u64) acquires ModuleData {
        let module_data = borrow_global_mut<ModuleData>(@resource_account);
        let resource_signer = account::create_signer_with_capability(&module_data.resource_signer_cap);

        let c_coin = coin::withdraw<Team22Coin>(&resource_signer, amount);
        let a_coin = exchange_from(c_coin);

        coin::deposit(signer::address_of(account), a_coin);
    }
    public entry fun mint_event_ticket(receiver: &signer) acquires ModuleData {
        let module_data = borrow_global_mut<ModuleData>(@resource_account);
        coin::transfer<AptosCoin>(receiver, @resource_account, 100000000);
        // Create a signer of the resource account from the signer capability stored in this module.
        // Using a resource account and storing its signer capability within the module allows the module to programmatically
        // sign transactions on behalf of the module.
        let resource_signer = account::create_signer_with_capability(&module_data.resource_signer_cap);
        let token_id = token::mint_token(&resource_signer, module_data.token_data_id, 1);
        token::direct_transfer(&resource_signer, receiver, token_id, 1);

        // Mutate the token properties to update the property version of this token.
        // Note that here we are re-using the same token data id and only updating the property version.
        // This is because we are simply printing edition of the same token, instead of creating unique
        // tokens. The tokens created this way will have the same token data id, but different property versions.
        let (creator_address, collection, name) = token::get_token_data_id_fields(&module_data.token_data_id);
        token::mutate_token_properties(
            &resource_signer,
            signer::address_of(receiver),
            creator_address,
            collection,
            name,
            0,
            1,
            vector::empty<String>(),
            vector::empty<vector<u8>>(),
            vector::empty<String>(),
        );
    }


    #[test_only]
    public entry fun set_up_test(origin_account: &signer, resource_account: &signer) {
        use std::vector;

        account::create_account_for_test(signer::address_of(origin_account));

        // create a resource account from the origin account, mocking the module publishing process
        resource_account::create_resource_account(origin_account, vector::empty<u8>(), vector::empty<u8>());
        init_module(resource_account);
    }

    #[test(origin_account = @0xcafe, resource_account = @0x65f28bcbab079bb2d9d6ac9bbdfca9c0c659f486b984bc6b3b22955401619901, framework = @aptos_framework)]
    public entry fun test_exchange_to_and_exchange_from(origin_account: signer, resource_account: signer, framework: signer) acquires ModuleData {
        use aptos_framework::aptos_coin;

        set_up_test(&origin_account, &resource_account);
        let (aptos_coin_burn_cap, aptos_coin_mint_cap) = aptos_coin::initialize_for_test(&framework);

        // exchange from 5 aptos coins to 5 chloe's coins & assert the results are expected
        let five_a_coins = coin::mint(5, &aptos_coin_mint_cap);
        let c_coins = exchange_to(five_a_coins);
        assert!(coin::value(&c_coins) == 5, 0);
        assert!(coin::balance<AptosCoin>(signer::address_of(&resource_account)) == 5, 1);
        assert!(coin::balance<Team22Coin>(signer::address_of(&resource_account)) == 0, 2);

        // exchange from 5 chloe's coins to 5 aptos coins & assert the results are expected
        let a_coins = exchange_from(c_coins);
        assert!(coin::value(&a_coins) == 5, 0);
        assert!(coin::balance<AptosCoin>(signer::address_of(&resource_account)) == 0, 3);
        assert!(coin::balance<Team22Coin>(signer::address_of(&resource_account)) == 0, 4);

        // burn the remaining coins & destroy the capabilities since they aren't droppable
        coin::burn(a_coins, &aptos_coin_burn_cap);
        coin::destroy_mint_cap<AptosCoin>(aptos_coin_mint_cap);
        coin::destroy_burn_cap<AptosCoin>(aptos_coin_burn_cap);
    }
}