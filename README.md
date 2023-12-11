<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="">
    <img src="https://tan-mad-salamander-939.mypinata.cloud/ipfs/QmcKiw5EGKYu37pJQ3o7av3iyG9Xz9JKFsP1suRACgwrTz" alt="Logo" width="200" height="">
  </a>

  <h4 align="center">Powered by</h4>
  <a href="">
    <img src="https://sapphire-petite-roundworm-454.mypinata.cloud/ipfs/Qmf9YhuoaaN43cWLsQ88zG49PsZCcCaXNX1iHDEg1hbbtK" alt="Logo" width="100" height="">
  </a>
  <h1 align="center">APTUNES</h1>

  <p align="center">
  Join the Symphony of Decentralization: Aptunes, Where Music Finds Freedom
    <br />
    <br />
    <a href="https://team22-client.vercel.app/">VISIT WEBSITE</a>
    <br />
    <a href="https://github.com/aptos-interiit/team22">GITHUB REPOSITORY</a>
    
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## About The Project

<div align="center">
 <a href="">
    <img src="https://sapphire-petite-roundworm-454.mypinata.cloud/ipfs/QmcDjyDmXXmBCYkijmPWj1zwDjUHfSQV2QsTnRRqexyUVf" alt="Logo" width="800" height="400">
  </a>
  <br></br>
</div>


[Aptunes](https://team22-client.vercel.app/) is a revolutionary decentralized on-chain radio and music platform deployed on the Aptos Blockchain. This innovative platform offers users a unique and decentralized approach to discovering and streaming music. By harnessing the power of blockchain technology, Aptunes ensures transparency, security, and fair compensation for artists and content creators.
Aptunes goes beyond traditional music platforms by introducing a groundbreaking real-time revenue distribution system. Artists on Aptunes experience instant and transparent compensation as listeners engage with their music. Through smart contracts, microtransactions are executed in real-time, ensuring fair and immediate payment to artists. This novel approach not only empowers artists but also transforms the way we appreciate and support music in a decentralized ecosystem.

Join Aptunes on its mission to reshape the music industry, providing artists and listeners alike with a fair, transparent, and community-driven platform.

### Features
* The streaming platform provides familiar controls like play, pause, and song liking while enabling easy playlist creation and song additions. Users craft personalized collections, shaping their music journey effortlessly.
* Permissionless access, a hallmark feature of this platform, offers users direct and intermediary-free access to upload and broadcast music. It enables creators to share their music seamlessly, bypassing any restrictions or middlemen.
* Real-time revenue distribution stands as a pivotal feature, dynamically allocating earnings based on listener interaction revenue and direct donations. It ensures real-time recognition and compensation for content as listeners engage, ensuring a direct and transparent support system between creators and their audience.
* The live radio feature allows users to craft personalized stations using a vast library of available songs, tailoring their listening experience. Additionally, users can explore and access radio stations curated by fellow users, diving into a diverse array of musical tastes and styles.
* Governance (DAO) emerges as a pivotal feature, empowering users to generate proposals, acquire NFT-based voting passes, and vote on platform decisions. Administrators utilize on/off-chain actions for effective execution. This governance feature grants active user participation, shaping the platform's direction efficiently and inclusively.


### Built With

Aptunes is crafted with cutting-edge technologies to provide a seamless and decentralized music experience. The key technologies used in the development of Aptunes include:

* [React](https://legacy.reactjs.org/)
* [Tailwind](https://tailwindcss.com/)
* [Move](https://github.com/move-language/move)
* [Aptos](https://aptoslabs.com/)
* [IPFS](https://ipfs.tech/)
* [Docker](https://www.docker.com/)



<!-- GETTING STARTED -->
## Getting Started

Follow these steps to set up and run Aptunes on your local machine:

### Setup using Docker

Follow the following steps to setup using docker.

#### Pre Requisites

* Install [Docker](https://docs.docker.com/engine/install/) on your system.

#### Setup Steps

* Clone this repository
    ```sh
    git clone https://github.com/aptos-interiit/team22.git
    ```

* Run your docker daemon.

* Make sure you are in root directory.
* Make .env files in server and client folders.
  ```sh
  touch ./client/.env && touch ./server/.env
  ```

* Add following in ```./client/.env```.
  ```sh
  REACT_APP_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhZTVlYWJkOS0zMjg4LTQ5OWUtYTAyMy05MWZmNzA5MTI2MzEiLCJlbWFpbCI6InNhcnRoYWsubmFuZHJlMzFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQzMjgxYTY0ZGU2YTgxMjljNzhjIiwic2NvcGVkS2V5U2VjcmV0IjoiM2QwMTEwMDE0MWU4YzMzZTA1MzJlNTdkZWQ0ODE0ZDUwYjhkMDlkZDE0ODhiY2I4M2RiOWY0MjNhYjc4ZTMwNiIsImlhdCI6MTY5OTYyNjg4MH0.5Jvi8BBOrdX5cDFRk6KIoR3FZv0sObmOJMB2oiO-uMI
  REACT_APP_MODULE_ADDRESS=0xd092ae09a4dc8dd1d352edc5de5a89062ae6eb55bc0c76d5a94e10781368d2b9
  REACT_APP_RESOURCE_ACCOUNT=0xf26abcb81b6c9980c27fc9637ddfbf0bad7e220f3f67d5e940ff2d37391d30ca
  REACT_APP_DAO_ADDRESS=0xc61b28c1536b6a24ec4dd25faf792089925b9d33e075b187a89e3d5293892766
  REACT_APP_SERVER_ADDRESS=http://localhost:4000
  ```

* Add following in ```./server/.env```.

  ```sh
  PRIVATE_KEY=0x6f2ad8728fb57391d2e8222a97bb5be7b2294044afc824c8bbe40840259fa702
  MODULE_ADDRESS=0xd092ae09a4dc8dd1d352edc5de5a89062ae6eb55bc0c76d5a94e10781368d2b9
  ```

* Now make sure that you are in the root directory of this project.

* Run the following command to spin up docker containers.
    ```sh 
    docker compose up
    ```

* After successfully creation of containers, the frontend will be on port ```3000```.

* Visit http://localhost:3000.


### Setup without using Docker

Follow the following steps to setup without using docker.

#### Pre Requisites

* Install [Node >=20](https://nodejs.org/en/download) on your system.

#### Setup Steps

* Clone this repository
    ```sh
    git clone https://github.com/aptos-interiit/team22.git
    ```

* Change directory to team22
    ```sh
    cd team22
    ```

* Make .env files in server and client folders.
  ```sh
  touch ./client/.env && touch ./server/.env
  ```

* Add following in ```./client/.env```.
  ```sh
  REACT_APP_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhZTVlYWJkOS0zMjg4LTQ5OWUtYTAyMy05MWZmNzA5MTI2MzEiLCJlbWFpbCI6InNhcnRoYWsubmFuZHJlMzFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQzMjgxYTY0ZGU2YTgxMjljNzhjIiwic2NvcGVkS2V5U2VjcmV0IjoiM2QwMTEwMDE0MWU4YzMzZTA1MzJlNTdkZWQ0ODE0ZDUwYjhkMDlkZDE0ODhiY2I4M2RiOWY0MjNhYjc4ZTMwNiIsImlhdCI6MTY5OTYyNjg4MH0.5Jvi8BBOrdX5cDFRk6KIoR3FZv0sObmOJMB2oiO-uMI
  REACT_APP_MODULE_ADDRESS=0xd092ae09a4dc8dd1d352edc5de5a89062ae6eb55bc0c76d5a94e10781368d2b9
  REACT_APP_RESOURCE_ACCOUNT=0xf26abcb81b6c9980c27fc9637ddfbf0bad7e220f3f67d5e940ff2d37391d30ca
  REACT_APP_DAO_ADDRESS=0xc61b28c1536b6a24ec4dd25faf792089925b9d33e075b187a89e3d5293892766
  REACT_APP_SERVER_ADDRESS=http://localhost:4000
  ```

* Add following in ```./server/.env```.

  ```sh
  PRIVATE_KEY=0x6f2ad8728fb57391d2e8222a97bb5be7b2294044afc824c8bbe40840259fa702
  MODULE_ADDRESS=0xd092ae09a4dc8dd1d352edc5de5a89062ae6eb55bc0c76d5a94e10781368d2b9
  ```

* Change directory to ```client```.

  ```sh
  cd client
  ```

* Install all client dependencies.
  ```sh
  npm install
  ```

  * If any error occurs, try running above with root permissions.

* Spin up the developmental client side.

  ```sh
  npm start
  ```

* Client side is now running on ```http://localhost:3000```.

* Change directory to ```server```.

  ```sh
  cd ../server
  ```

* Install all client dependencies.
  ```sh
  npm install
  ```

  * If any error occurs, try running above with root permissions.


* Install nodemon globally.

  ```sh
  npm install -g nodemon
  ```

* Spin up the developmental server side.

  ```sh
  nodemon server.js
  ```

  * If above command doesn't work, use this instead.

    ```sh
    node server.js
    ```

* Server side is now running on ```http://localhost:4000```.

* Visit http://localhost:3000.




<!-- USAGE EXAMPLES -->
## Usage

For usage and Project Demo, please checkout the Demo Video provided.

## Walkthrough of the Platform

* After registering as new user in landing page the page redirects to the main dashboard.
* Main dashboard provides different features to interact with the website.
* Add Deposit, converts your APT into our T22 Coin for smoother transactions. One can only listen to songs on the platform, if it has enough T22 Coins.
* Using Add Song feature, one can add song and also add collaborators and decide their split.
* So whenever, any user listens the song, the revenue is shared according to the split in real time. 
* On song change / unmounting the website / reloading the website, the revenue of current song is calculated proportional to the time listened, then signing of transaction occurs using a node server, and then the revenue automatically gets distributed to artists/collaborators. All transaction takes place using T22 Coin and a resource account with resource signer capabilities. Also the user is instantly notified about the revenue deduction after listening songs.
* Listeners can create their own playlist and add songs to it.
* Listeners have the option to add any song they enjoy to their liked songs playlist.
* Search feature is also integrated into our website.
* All further transaction occurs in T22 Coin. During revenue distribution, the listeners savings is decreased by revenue amount and the artist(s) balance of T22 Coin in their Wallet increases by amount according to the split.
* A user can withdraw its savings to APT anytime using Withdraw Savings Feature on profile page.
* Similarly anyone can withdraw their earnings (convert their T22 Coin asset into APT Coin) using Withdraw Earnings feature on profile page.
* A user/artist can create/delete/modify its own live radio consisting of different songs.
* The songs in the radio will be broadcasted and will be live to all users.
* Listener can donate to the radio creator using Turbo Tip, which directly transfers the given amount of APT Coin to the radio creator's account.
* In radio, song owners earn money based on how much time people spend listening to their songs.
* In our platform's DAO (Governance) system, the criteria are as follows:

  * DAO creation is restricted to platform administrators.
  * Proposals can be initiated by stakeholders staking a minimum of 10 T22 Coins.
  * Voting eligibility is extended to users holding an NFT Membership pass.
  * Once a proposal concludes, any user can address its resolution.
  * If a proposal is successfully resolved, administrators will execute the corresponding action either on-chain or off-chain.







<!-- ROADMAP -->
## Roadmap

- [x] Add Permissionless Access
- [x] Add Wallet Connectivity
- [x] Add Real-time distribution of revenue generated from listener interactions, tips, or paid content.
- [x] Add UI that allows listeners to discover, interact, and pay tips to artists.
- [x] Add Smart contracts to handle the automated distribution of funds and validate transactions.
- [x] Add Community-driven governance model (DAO) for protocol updates and feature additions.


<!-- CONTACT -->
## Contact

Team 22: team22interiittechmeet@gmail.com

Project Link: [https://github.com/aptos-interiit/team22](https://github.com/aptos-interiit/team22)

Website Link: [https://team22-client.vercel.app/](https://team22-client.vercel.app/)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
