module sender::music_platform {
    use std::string::{String};
    use std::signer;
    use std::string;
    use std::vector;
    use std::vector::{length};
    use aptos_std::table;
    use aptos_std::table::Table;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use resource_account::simple_defi;
    #[test_only]
    use aptos_std::debug;
    #[test_only]
    use aptos_framework::util::address_from_bytes;

    struct Song has key, store, drop, copy{
        id: u64,
        title: String,
        owner: address,
        ipfsHash: String,
        coverIpfs: String,
        timestamp: u64,
        timeListened: u64,
        streams: u64,
        artists: vector<address>,
        distri: vector<u64>,
        duration: u64,
        owner_name: String,
    }

    struct User has key, store, drop, copy{
        id: u64,
        name: String,
        user_address: address,
        songs: vector<Song>,
        earnings: u64,
        savings: u64,
        playlists: vector<Playlist>,
        profile_pic: String,
        location: String,
        description: String,
    }

    struct Radio has key, store, drop, copy {
        title: String,
        description: String,
        user_address: address,
        songs: vector<u64>,
        is_active: bool,
    }

    struct Playlist has key, store, drop, copy {
        name: String,
        songs: vector<u64>
    }

    struct Address_to_artist has key, store{
        content: Table<address, User>,
    }

    struct All_songs has key{
        count: u64,
        content: Table<u64, Song>,
        all_indexes: vector<u64>
    }

    struct All_users has key {
        count: u64,
        content: Table<u64, User>,
        all_indexes: vector<u64>
    }

    struct All_radios has key {
        count: u64,
        content: Table<u64, Radio>,
        all_indexes: vector<u64>
    }

    struct Constants has key {
        turboTip: u64,
        share: u64
    }

    #[view]
    public fun view_user(_owner: signer, account: address) : User acquires Address_to_artist {
        let addr_to_art = borrow_global_mut<Address_to_artist>(@sender);
        let tb = &addr_to_art.content;
        let user = table::borrow(tb, account);
        *user
    }

    entry fun init_module(resouce_signer: &signer) {
        let tb = Address_to_artist {
            content: table::new(),
        };
        let a_s = All_songs {
            count: 0,
            content: table::new(),
            all_indexes: vector::empty()
        };
        let a_u = All_users {
            count: 0,
            content: table::new(),
            all_indexes: vector::empty()
        };
        let a_r = All_radios {
            count: 0,
            content: table::new(),
            all_indexes: vector::empty()
        };
        let c = Constants {
            turboTip: 10,
            share: 0,
        };

        move_to(resouce_signer, tb);
        move_to(resouce_signer, a_s);
        move_to(resouce_signer, a_u);
        move_to(resouce_signer, a_r);
        move_to(resouce_signer, c);
    }

    public entry fun add_user(account: &signer, name: String, profile_pic: String, location: String, description: String) acquires Address_to_artist, All_users {
        let all_users = borrow_global_mut<All_users>(@sender);
        let owner = signer::address_of(account);
        let add_to_art = borrow_global_mut<Address_to_artist>(@sender);
        let c: vector<Song> = vector::empty<Song>();
        let p: vector<Playlist> = vector::empty<Playlist>();
        let s: vector<u64> = vector::empty<u64>();
        let empty_pl: Playlist = Playlist {
            name: string::utf8(b"Liked Songs"),
            songs: s
        };
        vector::push_back(&mut p, empty_pl);
        table::upsert(&mut add_to_art.content, owner, User {
            id: all_users.count,
            name,
            user_address: owner,
            songs: c,
            earnings: 0,
            savings: 0,
            playlists: p,
            profile_pic,
            location,
            description,
        });

        let c: vector<Song> = vector::empty<Song>();
        vector::push_back(&mut all_users.all_indexes, all_users.count);
        table::upsert(&mut all_users.content, all_users.count, User {
            id: all_users.count,
            name,
            user_address: owner,
            songs: c,
            earnings: 0,
            savings: 0,
            playlists: p,
            profile_pic,
            location,
            description,
        });
        all_users.count = all_users.count + 1;
        simple_defi::initial_registration(account);
    }

    public entry fun create_radio(account: &signer, title: String, description: String, is_active: bool, songs: vector<u64>) acquires All_radios,  {
        let all_radios = borrow_global_mut<All_radios>(@sender);
        vector::push_back(&mut all_radios.all_indexes, all_radios.count);
        table::upsert(&mut all_radios.content, all_radios.count, Radio {
            title,
            description,
            user_address: signer::address_of(account),
            songs,
            is_active
        });
        all_radios.count = all_radios.count + 1;
    }
    public entry fun delete_radio(account: &signer, key: u64) acquires All_radios {

        let all_radios = borrow_global_mut<All_radios>(@sender);
        assert!(signer::address_of(account) == table::borrow(&all_radios.content, key).user_address, 1);
        vector::remove_value(&mut all_radios.all_indexes, &key);
        table::remove(&mut all_radios.content, key);
    }
    public entry fun change_radio_state(account: &signer, key: u64, state: bool) acquires All_radios {
        let all_radios = borrow_global_mut<All_radios>(@sender);
        assert!(signer::address_of(account) == table::borrow(&all_radios.content, key).user_address, 1);
        let tb = &mut all_radios.content;
        let radio = table::borrow_mut(tb, key);
        radio.is_active = state;
    }

    public entry fun add_songs_to_radio(account: &signer, id: u64, songs: vector<u64>) acquires All_radios,  {
        let all_radios = borrow_global_mut<All_radios>(@sender);
        assert!(signer::address_of(account) == table::borrow(&all_radios.content, id).user_address, 1);
        let radio = table::borrow_mut(&mut all_radios.content, id);
        let i = 0;
        while(i < vector::length(&songs)) {
            let song_idx = vector::borrow(&mut songs, i);
            vector::push_back(&mut radio.songs, *song_idx);
            i = i + 1;
        }
    }
    public entry fun delete_song_from_radio(account: &signer, id: u64, song: u64) acquires All_radios {
        let all_radios = borrow_global_mut<All_radios>(@sender);
        assert!(signer::address_of(account) == table::borrow(&all_radios.content, id).user_address, 1);
        let radio = table::borrow_mut(&mut all_radios.content, id);
        vector::remove_value(&mut radio.songs, &song);
    }
    public entry fun change_user_data(account: &signer, name: String, profile_pic: String, description: String, location: String) acquires Address_to_artist, All_users {
        let add_to_art = borrow_global_mut<Address_to_artist>(@sender);
        let owner = signer::address_of(account);
        let curr = table::borrow_mut(&mut add_to_art.content, owner);

        curr.name = name;
        curr.location=location;
        curr.description=description;
        curr.profile_pic=profile_pic;
        let id = curr.id;
        let all_users = &mut borrow_global_mut<All_users>(@sender).content;
        let user = table::borrow_mut(all_users, id);
        user.name = name;
        user.location= location;
        user.description=description;
        user.profile_pic=profile_pic;
    }

    public entry fun add_song(account: &signer, title: String, ipfsHash: String, coverIpfs: String, timestamp: u64,artists: vector<address>,distri: vector<u64>, duration: u64, owner_name: String) acquires All_songs, Address_to_artist {
        let add_to_art = borrow_global_mut<Address_to_artist>(@sender);
        let table = &add_to_art.content;
        let sum: u64 = 0;
        let i: u64 = 0;

        let length_distri = length(&distri);
        let length_artists = length(&artists);
        while (i < length_distri) {
            let entry = vector::borrow(&distri, i);
            sum = sum + *entry;
            let addr = vector::borrow(&artists, i);
            assert!(table::contains(table, *addr), 1);
            i = i+1;
        };
        assert!(length_distri == length_artists, 1);
        assert!(sum == 100, 1);
        let owner = signer::address_of(account);
        let module_data = borrow_global_mut<All_songs>(@sender);
        module_data.count = module_data.count+1;
        table::upsert(&mut module_data.content, module_data.count, Song{
            id: module_data.count,
            title,
            ipfsHash,
            owner,
            coverIpfs,
            timestamp,
            timeListened:0,
            artists,
            distri,
            duration,
            owner_name,
            streams: 0
        });

        let curr = table::borrow_mut(&mut add_to_art.content, owner);
        vector::push_back(&mut curr.songs, Song{
            id: module_data.count,
            title,
            owner,
            ipfsHash,
            coverIpfs,
            timestamp,
            timeListened:0,
            artists,
            distri,
            duration,
            owner_name,
            streams: 0,
        });
        vector::push_back(&mut module_data.all_indexes, module_data.count);
    }

    public entry fun change_song_ipfs_cover(account: &signer, id: u64, ipfs_cover: String) acquires All_songs, Address_to_artist {
        let module_data = borrow_global_mut<All_songs>(@sender);
        let song = table::borrow_mut(&mut module_data.content, id);
        // let add_to_art = borrow_global_mut<Address_to_artist>(@sender);
        let owner = signer::address_of(account);
        assert!(owner == song.owner, 1);
        song.coverIpfs = ipfs_cover;
        let add_to_artist = &mut borrow_global_mut<Address_to_artist>(@sender).content;
        let user = table::borrow_mut(add_to_artist, owner);
        let pl = &mut user.songs;
        let i: u64 = 0;
        let length = length(pl);
        while (i < length) {
            let sng = vector::borrow_mut(pl, i);
            if (sng.id == id) {
                sng.coverIpfs = ipfs_cover;
                break
            }
        }

    }


    public entry fun remove_song(account: &signer, id : u64) acquires Address_to_artist, All_songs, All_users, All_radios {
        let all_songs = & borrow_global<All_songs>(@sender).content;
        let sng = table::borrow(all_songs, id);
        assert!(sng.owner == signer::address_of(account), 1);
        resolve_delete_song(id);
    }

    public entry fun add_deposit (account: &signer, amount: u64) acquires Address_to_artist, All_users {
        let users = borrow_global_mut<Address_to_artist>(@sender);
        let cur_user = table::borrow_mut(&mut users.content, signer::address_of(account));
        let id = cur_user.id;
        let all_user = &mut borrow_global_mut<All_users>(@sender).content;
        let user = table::borrow_mut(all_user, id);
        user.savings = user.savings + amount;
        cur_user.savings = cur_user.savings + amount;
        simple_defi::exchange_to_entry_resource(account, amount);
    }

    public entry fun user_to_artist (account: signer,userAddress: address, artists: vector<address>,distri: vector<u64>, amount: u64) acquires Address_to_artist, All_users{
        let state = borrow_global_mut<Address_to_artist>(@sender);
        let _ = signer::address_of(&account);
        let addr_user = userAddress;

        let user: &mut User = table::borrow_mut(&mut state.content, addr_user);
        let id = user.id;
        user.savings = user.savings - amount;
        let all_user = &mut borrow_global_mut<All_users>(@sender).content;
        let user = table::borrow_mut(all_user, id);
        user.savings = user.savings - amount;
        let len = length(&artists);
        let i = 0;
        while(i < len){
            let art: &mut User = table::borrow_mut(&mut state.content, *vector::borrow(&mut artists, i));
            let d = *vector::borrow(&mut distri, i);
            let d2 = (amount*d)/100;
            simple_defi::custom_to_custom(art.user_address, d2);
            i = i + 1;
        };
    }

    public entry fun update_timelistened (account: signer, id: u64, time: u64) acquires All_songs, Address_to_artist{
        assert!(signer::address_of(&account) == @sender, 1);
        let all_songs = borrow_global_mut<All_songs>(@sender);
        let song = table::borrow_mut(&mut all_songs.content, id);
        let artist = song.owner;
        let addr_to_artist  = &mut borrow_global_mut<Address_to_artist>(@sender).content;
        let user = table::borrow_mut(addr_to_artist, artist);
        let sngs = &mut user.songs;
        let i: u64 = 0;
        let len = length(sngs);
        while (i < len) {
            let sng = vector::borrow_mut(sngs, i);
            if (sng.id == id) {
                sng.timeListened = sng.timeListened + time;
                break
            };
            i = i + 1;
        };
        song.timeListened = song.timeListened + time;
        if (time>= 30) {
            song.streams = song.streams+1;
        }
    }

    public entry fun withdraw_savings_toAptos(account: signer) acquires Address_to_artist, All_users {
        let to = signer::address_of(&account);
        let add_to_art: &mut Address_to_artist = borrow_global_mut<Address_to_artist>(@sender);
        let curr = table::borrow_mut(&mut add_to_art.content, to);
        let id = curr.id;
        simple_defi::exchange_from_entry_resource(&account, curr.savings);
        curr.savings = 0;

        let all_user = &mut borrow_global_mut<All_users>(@sender).content;
        let user = table::borrow_mut(all_user, id);
        user.savings = 0;
    }

    public entry fun withdraw_earnings_toAptos(account: signer, amount: u64) {
        simple_defi::exchange_from_entry(&account, amount);
    }

    public entry fun create_playlist(account: &signer, name: String) acquires Address_to_artist, All_users {
        let add_to_artist: &mut Address_to_artist = borrow_global_mut<Address_to_artist>(@sender);
        let add = signer::address_of(account);
        let user = table::borrow_mut(&mut add_to_artist.content, add);
        let id = user.id;
        let empty_pl: Playlist = Playlist {
            name,
            songs: vector::empty<u64>(),
        };
        vector::push_back(&mut user.playlists, empty_pl);

        let all_user = &mut borrow_global_mut<All_users>(@sender).content;
        let user2 = table::borrow_mut(all_user, id);
        vector::push_back(&mut user2.playlists, empty_pl);
    }

    public entry fun add_song_to_playlist(account: &signer, song_id: u64, name: String) acquires Address_to_artist, All_users {
        let add_to_artist: &mut Address_to_artist = borrow_global_mut<Address_to_artist>(@sender);
        let add = signer::address_of(account);
        let user = table::borrow_mut(&mut add_to_artist.content, add);
        let i = 0;
        let len = length(&user.playlists);
        let id = user.id;
        while (i < len) {
            let pl = vector::borrow_mut(&mut user.playlists, i);
            if (pl.name == name) {
                vector::push_back(&mut pl.songs, song_id);
                break
            };
            i = i + 1
        };
        let s: vector<u64> = vector::empty<u64>();
        vector::push_back(&mut s, song_id);
        if (i == len) {
            let empty_pl: Playlist = Playlist {
                name,
                songs: s
            };
            vector::push_back(&mut user.playlists, empty_pl);
        };

        let all_user = &mut borrow_global_mut<All_users>(@sender).content;
        let user2 = table::borrow_mut(all_user, id);
        let i = 0;
        let len = length(&user2.playlists);
        while (i < len) {
            let pl = vector::borrow_mut(&mut user2.playlists, i);
            if (pl.name == name) {
                vector::push_back(&mut pl.songs, song_id);
                break
            };
            i = i + 1
        };
        let s: vector<u64> = vector::empty<u64>();
        vector::push_back(&mut s, song_id);
        if (i == len) {
            let empty_pl: Playlist = Playlist {
                name,
                songs: s
            };
            vector::push_back(&mut user.playlists, empty_pl);
        };

    }

    public entry fun remove_song_from_playlist(account: signer, song_id: u64, name: String) acquires Address_to_artist, All_users {
        let add_to_artist: &mut Address_to_artist = borrow_global_mut<Address_to_artist>(@sender);
        let add = signer::address_of(&account);
        let user = table::borrow_mut(&mut add_to_artist.content, add);
        let id=user.id;
        let i = 0;
        let len = length(&user.playlists);
        while (i < len) {
            let pl = vector::borrow_mut(&mut user.playlists, i);
            if (pl.name == name) {
                vector::remove_value(&mut pl.songs, &song_id);
                break
            };
            i = i + 1
        };

        let all_user = &mut borrow_global_mut<All_users>(@sender).content;
        let user2 = table::borrow_mut(all_user, id);
        let i = 0;
        let len = length(&user2.playlists);
        while (i < len) {
            let pl = vector::borrow_mut(&mut user2.playlists, i);
            if (pl.name == name) {
                vector::remove_value(&mut pl.songs, &song_id);
                break
            };
            i = i + 1
        };
    }

    public entry fun delete_playlist(account: signer, name: String) acquires Address_to_artist, All_users {
        let add_to_artist: &mut Address_to_artist = borrow_global_mut<Address_to_artist>(@sender);
        let add = signer::address_of(&account);
        let user = table::borrow_mut(&mut add_to_artist.content, add);
        let id = user.id;
        let i = 0;
        let len = vector::length(&user.playlists);
        let index_to_remove: u64 = len + 1; // Initialize with a large value

        while (i < len) {
            let pl = vector::borrow(&user.playlists, i);

            if (pl.name == name) {
                // Store the index to remove and break the loop
                index_to_remove = i;
                break
            };

            i = i + 1;
        };

        // Check if an index was found for removal
        if (index_to_remove < len) {
            vector::remove(&mut user.playlists, index_to_remove);
        };
        let all_user = &mut borrow_global_mut<All_users>(@sender).content;
        let user2 = table::borrow_mut(all_user, id);
        let i = 0;
        let len = length(&user2.playlists);
        let id_to_rm: u64 = len+1;
        while (i < len) {
            let pl = vector::borrow_mut(&mut user2.playlists, i);
            if (pl.name == name) {
                id_to_rm = i;
                break
            };
            i = i + 1
        };
        if (id_to_rm < len) {
            vector::remove(&mut user2.playlists, id_to_rm);
        }

    }
    public fun fetch_entry (account: address): u64 acquires Address_to_artist {
        let addr_to_artist = borrow_global_mut<Address_to_artist>(@sender);
        let tb= & addr_to_artist.content;
        let user = table::borrow(tb, account);
        user.savings
    }
    public fun is_song_exists (song_id: u64) : bool acquires All_songs {
        let all_songs = borrow_global<All_songs>(@sender);
        let tb = &all_songs.content;
        let rt: bool = table::contains(tb, song_id);
        rt
    }
    public fun is_artist_exist (artist: address) : bool acquires Address_to_artist {
        let all_users = borrow_global<Address_to_artist>(@sender);
        let tb = & all_users.content;
        let resp = table::contains(tb, artist);
        resp
    }
    public entry fun donate(from: signer, to: address, amount: u64) acquires Constants {
        let constants = borrow_global<Constants>(@sender);
        assert!(constants.turboTip < 100, 1);
        let share_to_artist :u64 = (amount * (100 - constants.turboTip))/100;
        let share_to_platform = amount - share_to_artist;
        coin::transfer<AptosCoin>(&from, to, share_to_artist);
        coin::transfer<AptosCoin>(&from, @resource_account, share_to_platform);
    }

    public fun resolve_delete_song (song_id: u64) acquires All_songs, Address_to_artist, All_users, All_radios {
        let all_user = borrow_global_mut<All_users>(@sender);
        let user_vec = &all_user.all_indexes;
        let users = &mut all_user.content;
        let i: u64 = 0;
        let len = length(user_vec);
        while (i < len) {
            let user = table::borrow_mut(users, i);
            let user_address = user.user_address;
            let user_p = &mut borrow_global_mut<Address_to_artist>(@sender).content;
            let user_p2 = table::borrow_mut(user_p, user_address);
            let user_playlists2 = &mut user_p2.playlists;
            let user_playlists = &mut user.playlists;
            let j: u64 = 0;
            let len2 = length(user_playlists);
            while (j < len2) {
                let playlist = vector::borrow_mut(user_playlists, j);
                let songs = &mut playlist.songs;
                vector::remove_value(songs, &song_id);
                j = j+1;
            };
            let k: u64 = 0;
            let len3 = length(user_playlists2);
            while (k < len3) {
                let playlist = vector::borrow_mut(user_playlists2, k);
                let songs = &mut playlist.songs;
                vector::remove_value(songs, &song_id);
                k = k+1;
            };
            i = i+1;
        };
        let module_data = borrow_global_mut<All_songs>(@sender);
        let song = table::borrow(&mut module_data.content, song_id);
        let add_to_art = borrow_global_mut<Address_to_artist>(@sender);
        let user = table::borrow_mut(&mut add_to_art.content, song.owner);
        let (_, index) =  vector::index_of(&user.songs, song);
        vector::remove(&mut user.songs, index);
        table::remove(&mut module_data.content, song_id);
        let (is_present, index) =  vector::index_of(&module_data.all_indexes, &song_id);
        assert!(is_present, 1);
        vector::remove(&mut module_data.all_indexes, index);

        let all_radio_data = borrow_global_mut<All_radios>(@sender);
        let all_radio_table = &mut all_radio_data.content;
        let all_radios = &mut all_radio_data.all_indexes;
        let len = vector::length(all_radios);
        let i = 0;
        while(i < len) {
            let radio_id = vector::borrow(all_radios, i);
            let radio = table::borrow_mut(all_radio_table, *radio_id);
            vector::remove_value(&mut radio.songs, &song_id);
            i = i + 1;
        }
    }

    public fun resolve_delete_artist (artist: address) acquires Address_to_artist, All_users, All_songs, All_radios {
        let addr_to_artist = borrow_global_mut<Address_to_artist>(@sender);
        let tb = &mut addr_to_artist.content;
        let artist = table::remove(tb, artist);
        let id = artist.id;
        let all_user = borrow_global_mut<All_users>(@sender);
        let table = &mut all_user.content;
        table::remove(table, id);
        let songs = artist.songs;
        let length = length(&songs);
        let i: u64=0;

        while (i < length){
            let sng = vector::borrow(&songs, i);
            resolve_delete_song(sng.id);
            i = i+1;
        }
    }
    #[view]
    public fun view_songs (account: address): vector<u64> acquires Address_to_artist{
        let add_to_art = borrow_global<Address_to_artist>(@sender);
        let tb = &add_to_art.content;
        let user = table::borrow(tb, account);
        let resp: vector<u64> = vector::empty<u64>();
        let i: u64 = 0;
        let len = length(&user.songs);
        let songs = &user.songs;
        while (i < len) {
            let sng = vector::borrow(songs, i);
            vector::push_back(&mut resp, sng.id);
            i = i+1;
        };
        resp
    }
    #[view]
    public fun fetch_entry_view (account: address): u64 acquires Address_to_artist {
        let addr_to_artist = borrow_global_mut<Address_to_artist>(account);
        let tb= & addr_to_artist.content;
        let user = table::borrow(tb, account);
        user.savings
    }
    #[test]
    public fun to_bcs() {
        // let addstr: String = string::utf8(b"0x3a7e69b2a8278b89132f37fa2241563692cc22d7ec376048579de7dddd387c6f");
        // let someth = bcs::to_bytes(&addstr);
        // debug::print(&someth);
        // let rev = from_bcs::to_string(someth);
        // debug::print(&rev);

        let str= b"0x2d864126b0acbd08e20b01421b08693048c087f631cf287603c5bf073289d6f2";
        let addr = address_from_bytes(str);
        debug::print(&str);
        debug::print(&addr);
        assert!(addr == @0x2d864126b0acbd08e20b01421b08693048c087f631cf287603c5bf073289d6f2, 1);
    }

}