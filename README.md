# SignedIn: A login website using React and Pocketbase

## Features

- [x] Sign in
  - [x] Sign in with GitHub
- [x] Sign up
  - [x] Sign up with GitHub
- [x] Reset password
- [x] Verify email
  - [x] Gold Checkmark System. (This is a feature that allows the admin to give special users a gold checkmark next to their name via the database admin panel.)

## What is this?

SignedIn is an example of how to use React and Pocketbas to build a login website. It is a website that allows users to sign in, sign up, reset their password, and verify their email. It also has a feature that allows the admin to give special users a gold checkmark next to their name via the database admin panel. It also uses GitHub OAuth to allow users to sign in and sign up with their GitHub account.

## How to run locally and/or deploy to a remote server

1. Clone the repo

```bash
git clone https://github.com/Zfauser/SignedIn-Public.git
```

2. Install dependencies

```bash
npm install
```

3. Run the app
    &nbsp;
    
    3.1. Development mode
  
    In one terminal window, run:
    
    ```bash
    npm start
    ```
    
    In another terminal window, run:
    
  
    ```bash
    ./pocketbase serve
    ```

    The pocketbase executable included is the MacOS version. If you are using a different OS, you can download the executable from [here](https://github.com/pocketbase/pocketbase/releases/)

    NOTE: You will also need to change all of the database urls and redirect urls in the files to your own. By default, the pocketbase server url will be `http://127.0.0.1:8090` and the web site will be run on `http://127.0.0.1:3000`. You will also need to add your own GitHub OAuth info on the Admin panel.

    &nbsp;
    3.2. Production mode

    ```bash
    npm run build
    ```

    Then deploy the `build` folder to any type of web server. (apache, nginx, etc.)

    Then deploy pocketbase to another server. (You might be able to run it on the same server as the web server through something like a reverse proxy, but I haven't tested it.)

    Then run the following command to start pocketbase via http & https. (you should setup something to make it so this command runs at startup using something like systemd)

    ```bash
    ./pocketbase serve --http="example.com:80" --https="example.com:443"
    ```

    Pocketbase is supposed to automatically get a SSL certificate from [Let's Encrypt](https://letsencrypt.org/), but it didn't work for me, so I had to manually get another certificate from Certbot and then put it in the `pb_data` folder on the server.
    &nbsp;

## How I deployed it

I deployed the static files to an existing [apache](https://httpd.apache.org/) server I use to run all my other websites. I also needed to get a new SSL certificate for the domain I was using ([signedin.zachfauser.com](https://signedin.zachfauser.com/)). I used [Certbot](https://certbot.eff.org/) to get the certificate. I then needed to create a new Oracle Cloud Virtual Machine to run database. I used the same specs as the apache server (2 core arm cpu, 12gb ram, ubuntu). I then installed pocketbase on the new server. I also got a new SSL certificate for the pocketbase server on the domain I was using. I then created a simple Systemd service to make the pocketbase server start on startup and run in the background.

## Links to the technologies used

- [Apache HTTP Server](https://httpd.apache.org/)
- [Certbot](https://certbot.eff.org/)
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Let's Encrypt](https://letsencrypt.org/)
- [Node.js](https://nodejs.org/en/)
- [Oracle Cloud Infrastructure](https://www.oracle.com/ca-en/cloud/)
- [Pocketbase](https://pocketbase.io/)
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Ubuntu](https://ubuntu.com/)
