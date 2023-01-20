import React from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://database.example.com:443/');
const redirectUrl = 'https://app.example.com/redirect';
const params = (new URL(window.location)).searchParams; // get url params
const codeVerifier = localStorage.getItem('codeverifier');

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    authenticate = async () => {
        console.log('run') // debug
        pb.collection('users').authWithOAuth2( // authenticate with github
            'github',
            params.get('code'),
            codeVerifier,
            redirectUrl,
            {
                emailVisibility: false,
            }
        ).then((authData) => {
            document.getElementById('content').innerText = JSON.stringify(authData, null, 2); // display authData
            //set username to github username
            console.log(authData.meta.username)
            pb.collection('users').update(pb.authStore.model.id, {
                username: authData.meta.username + '_github', // change users username to github username + '_github' to prevent conflicts
            }).catch((err) => {
                document.getElementById('content2').innerText = "Failed to update username.\n" + err; // incase of error, display error
            });
            // redirect to profile page
            window.location.href = "/profile";
        }).catch((err) => {
            document.getElementById('content').innerText = "Failed to exchange code.\n" + err;
            document.getElementById('content2').innerText = "Would you like to return to the home page?";
            document.getElementById('content3').innerHTML = "<a href='/'>Return to home page</a>"; // incase of error, allow user to return to home page
        });
    }

    render() { // The render function
        this.authenticate();
        return (
            <div>
                <h1>Redirect</h1>
                <p id='content' >Redirecting...</p>
                <p id='content2' ></p>
                <p id='content3' ></p>
            </div>
        );
    }
}

export default Main;