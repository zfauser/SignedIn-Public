import React from 'react';
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://database.example.com:443/');

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    sendCode = async (e) => {
        e.preventDefault();
        console.log(this.state.email);
        if (this.state.email === undefined) {
            alert("Please enter your email address.");
            return;
        } else {
            try {
                await pb.collection('users').requestPasswordReset(this.state.email); // Send password reset link to email

                alert("A password reset link has been sent to your email address.");
                window.location.href = "/"; // Redirect to sign in page
            } catch (err) {
                alert("An error occurred. Please double check your information again."); // Error handling
            }
        }
    }
    render() {
        return ( // Forgot password page HTML
            <div className="main">
                <h1>Forgot Password</h1>
                <p>Enter your email and we'll send
                    <br></br>
                    you a link to reset your password.</p>
                <div className="textbox-container">
                    <input type="email" placeholder="Email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                    <br></br>
                    <br></br>
                    <button onClick={this.sendCode}>Send Link</button>
                </div>
                <br></br>
                <br></br>
                <a href="/">Back to Sign In</a>
            </div >
        );
    }
}

export default Main;