import React from 'react';
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://database.example.com:443/');

const redirectUrl = 'https://app.example.com/redirect';

let authURL = '';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getAuthMethods = async () => {
        // This function will get the authentication methods from the Database
        const authMethods = await pb.collection('users').listAuthMethods();
        console.log(authMethods);
        const provider = authMethods.authProviders;
        console.log(provider);
        const providerName = provider[0].name;
        console.log(providerName);
        const providerUrl = provider[0].authUrl;
        console.log(providerUrl);
        authURL = providerUrl;
        console.log(provider[0].codeVerifier)
        localStorage.setItem('codeverifier', provider[0].codeVerifier);
    }

    submitCreateAccount = async (e) => { // When the user submits the form
        e.preventDefault();
        console.log(this.state);
        // if any of the fields are blank, alert the user
        if (this.state.name === undefined || this.state.username === undefined || this.state.email === undefined || this.state.password === undefined || this.state.passwordConfirm === undefined) {
            alert("Please fill out all fields.");
            return;
        } // if username contains a space, alert the user
        else if (this.state.username.includes(" ")) {
            alert("Username cannot contain spaces.");
            return;
        } else if (this.state.username.includes("🍕")) {
            alert("Username cannot contain 🍕.");
            return;
        } else if (this.state.username.includes("_github")) {
            alert("Username cannot contain '_github'.");
            return;
        }
        try {
            const newUser = await pb.collection('users').create(this.state); // Create new user

            await pb.collection('users').requestVerification(this.state.email); // Send verification email to user
            window.location.href = "/";
            console.log(newUser);
        } catch (err) {
            let ErrorData = err.data;
            console.log(err.data);
            console.log(ErrorData.data);
            try { // Check if the error is with the email
                alert("An error occured with your email: " + ErrorData.data.email.message);
            }
            catch (err) { // if the error is not with the email, check the password
                try {
                    alert("An error occured with your password: " + ErrorData.data.password.message);
                } catch (err) { // if the error is not with the password, check the password confirmation
                    try {
                        alert("An error occured with your password confirmation: " + ErrorData.data.passwordConfirm.message);
                    } catch (err) { // if the error is not with the password confirmation, check the username
                        try {
                            alert("An error occured with your username: " + ErrorData.data.username.message);
                        } catch (err) { // if the error is not with the username, check the name
                            try {
                                alert("An error occured with your name: " + ErrorData.data.name.message);
                            } catch (err) { // if no errors are found, alert the user that an error occurred
                                alert("An error occurred. Please double check your information again.");
                            }
                        }
                    }
                }
            }
        }
    }

    render() {
        if (pb.authStore.isValid) { // If the user is already signed in, redirect them to their profile page
            window.location.href = "/profile";
        } else {
            return ( // Sign up page HTML
                <div className="main">
                    <h1>Welcome to SignedIn!</h1>
                    <p>How about you get SignedUp?</p>
                    <div className="textbox-container">
                        <form onSubmit={this.submitCreateAccount}>
                            <input type="text" placeholder="Name" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                            <br></br>
                            <input type="text" placeholder="Username" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                            <br></br>
                            <input type="email" placeholder="Email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                            <br></br>
                            <input type="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                            <br></br>
                            <input type="password" placeholder="Confirm Password" value={this.state.passwordConfirm} onChange={e => this.setState({ passwordConfirm: e.target.value })} />
                            <br></br>
                            <br></br>
                            <button type="submit">Sign Up</button>
                        </form>
                        <br></br>
                        <button onClick={
                            () => {
                                window.location.href = authURL + redirectUrl;
                            }
                        }>Sign up with GitHub</button>
                    </div>
                    <br></br>
                    <br></br>
                    <a href="/">Already have an account? Sign In here!</a>
                </div>
            );
        }
    }
}

export default Main;