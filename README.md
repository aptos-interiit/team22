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

  <h1 align="center">APTUNES</h1>

  <p align="center">
  Join the Symphony of Decentralization: Aptunes, Where Music Finds Freedom
    <br />
    <a href="https://team22-client.vercel.app/">Visit Website</a>
    
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<div align="center">
 <a href="">
    <img src="https://tan-mad-salamander-939.mypinata.cloud/ipfs/QmNRghQ8tM12A7hLXTBU1dShgaNAhCQ4vgMHVmsThQNZ6s" alt="Logo" width="800" height="400">
  </a>
</div>


Aptunes is a revolutionary decentralized on-chain radio and music platform deployed on the Aptos Blockchain. This innovative platform offers users a unique and decentralized approach to discovering and streaming music. By harnessing the power of blockchain technology, Aptunes ensures transparency, security, and fair compensation for artists and content creators.
Aptunes goes beyond traditional music platforms by introducing a groundbreaking real-time revenue distribution system. Artists on Aptunes experience instant and transparent compensation as listeners engage with their music. Through smart contracts, microtransactions are executed in real-time, ensuring fair and immediate payment to artists. This novel approach not only empowers artists but also transforms the way we appreciate and support music in a decentralized ecosystem.

Join Aptunes on its mission to reshape the music industry, providing artists and listeners alike with a fair, transparent, and community-driven platform.




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

* Install [Node ^20](https://nodejs.org/en/download) on your system.

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

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



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
