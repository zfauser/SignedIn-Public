import React from 'react';
import { ReactDOM, useState } from 'react';
import PocketBase from 'pocketbase';
import './homeStyle.css';
import { Routes, Route, Navigate } from 'react-router-dom';

const pb = new PocketBase('https://database.example.com:443/'); // Connect to the Database

const redirectUrl = 'https://app.example.com/redirect';

let authURL = '';

const login = async () => {
    // If user is already logged in, redirect to profile page
    if (pb.authStore.isValid) {
        //href="/main"
        console.log("logged in")
        window.location.href = "/profile";
    } else {
        console.log("not logged in")
    }
}

const attemptLogin = async () => {
    // An async function to attempt to login
    console.log("attempting login");
    await login();
}

class Main extends React.Component {
    // This class will be used for signing in
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
    submitLogin = async (e) => {
        e.preventDefault();
        console.log(this.state.username);
        console.log(this.state.password);
        try {
            const authData = await pb.collection('users').authWithPassword(
                this.state.username,
                this.state.password
            ); // Attempt to login
        } catch (err) { // If there is an error, alert the user with the possible error
            let ErrorData = err.data;
            console.log(ErrorData);
            console.log(ErrorData.data);
            alert("An error occurred. Please double check your information again. Error: " + err.message);
            // The reason this is not error trapped like the sign up page is because the error messages from the Database are not very descriptive
        }
        if (pb.authStore.isValid) { // If the user is logged in, redirect to the profile page
            console.log("logged in")
            window.location.href = "/profile";
            localStorage.setItem('username', this.state.username);
        } else {
            console.log("not logged in")
        }
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore.model.id);
    }
    render() {
        this.getAuthMethods();
        if (pb.authStore.isValid) { // If the user is logged in, redirect to the profile page
            return (
                // use react router to redirect to the signed in page (/main)
                <Routes>
                    <Route path="*" element={<Navigate to="/profile" />} />
                </Routes>
            );
        }
        return ( // This is the html for the sign in page
            <div className="App">
                <h1 className="welcomeMessage"  >Welcome to SignedIn, <br></br> i'm glad you're here!</h1>
                <p>
                </p>
                <div className="loginMessage">Please sign in to continue.</div>
                <br></br>
                <div className="textbox-container">
                    <form onSubmit={this.submitLogin}>
                        <br></br>
                        <input type="text" placeholder="Username" value={this.state.username} onChange={e => this.setState({ username: e.target.value })}></input>
                        <br></br>
                        <input type="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}></input>
                        <br></br>
                        <br></br>
                        <button type="submit" onClick={attemptLogin} >Sign In</button>
                        <br></br>
                        <br></br>
                    </form>
                    {/* button that will redirect to the github oauth page */}
                    <button onClick={
                        () => {
                            window.location.href = authURL + redirectUrl;
                        }
                    }>Sign in with GitHub</button>
                </div>
                <br></br>
                <br></br>
                <a href="/forgotpassword">Forgot Password?</a>
                <br></br>
                <br></br>
                <a href="/signup">Don't have an account? Create One here!</a>
            </div >
        );
    }
}

export default Main;
