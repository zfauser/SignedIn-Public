import React from 'react';
import PocketBase from 'pocketbase';
import logo from '../../assets/logo.png';
import './main.css';
const pb = new PocketBase('https://database.example.com:443/');
// let pocketbaseAuth = localStorage.getItem('pocketbase_auth');
// let token = JSON.parse(pocketbaseAuth).token;

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    logout() { // A function to log the user out
        delete localStorage.username;
        delete localStorage.pocketbase_auth;
        pb.authStore.clear();
        window.location.href = "/";
    }

    checkVerified = async () => { // A function to check if the user is verified
        //let isVerified = await pb.collection('users').
        await pb.collection('users').authRefresh();
        let isVerified = pb.authStore.model.verified;
        if (pb.authStore.isValid) {
            console.log("verified: " + isVerified);
            if (isVerified) {
                const greyCheckmark = document.getElementById("grey");
                const blueCheckmark = document.getElementById("blue");
                const goldCheckmark = document.getElementById("gold");
                const checkmarkMessage = document.getElementById("checkmark-message");
                const checkmarkMessage2 = document.getElementById("checkmark-message2");
                const verifyButton = document.getElementById("verify-button");
                const sendVerifyButton = document.getElementById("send-verify-email");
                const everyBodyKnowsTheRules = document.getElementById("everybody-knows-the-rules");
                greyCheckmark.classList.add("hidden");
                blueCheckmark.classList.remove("hidden");
                checkmarkMessage.classList.add("hidden");
                checkmarkMessage2.classList.add("hidden");
                verifyButton.classList.add("hidden");
                sendVerifyButton.classList.add("hidden");
                if (pb.authStore.model.onebite) {
                    everyBodyKnowsTheRules.classList.remove("hidden");
                }
                if (pb.authStore.model.gold_verified) {
                    blueCheckmark.classList.add("hidden");
                    goldCheckmark.classList.remove("hidden");
                }
            } else {
                const checkmarkMessage = document.getElementById("checkmark-message");
                checkmarkMessage.classList.remove("hidden");
            }
        } else {
            return false;
        }
    }

    resendVerification = async () => { // A function to resend the verification email
        const email = pb.authStore.model.email;
        await pb.collection('users').authRefresh();
        await pb.collection('users').requestVerification(email);
        alert("Sent verification email to " + email)
    }

    render() { // The render function
        const username = pb.authStore.model.username;
        if (!pb.authStore.isValid) { // If the user is not logged in return home
            // redirect to login page
            window.location.href = "/";
        } else {
            return ( // This is the HTML for the profile page. NOTE: The checkmark with gold id and the id everybody-knows-the-rules can only be given to the user via the database admin panel
                <div>
                    <h1>Profile</h1>
                    <div className="textbox-container">
                        <div className="name-checkmark">
                            <p className="welcome">Welcome, {username}</p><p id="everybody-knows-the-rules" className="hidden">🍕</p>
                            <div className="checkmark-container">
                                <svg viewBox="0 0 24 24" className="checkmark" id="grey" aria-label="Verified account" role="img" data-testid="icon-verified" fill="#829AAB">
                                    <g>
                                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
                                    </g>
                                </svg>
                                <svg viewBox="0 0 24 24" className="checkmark hidden" id="blue" aria-label="Verified account" role="img" data-testid="icon-verified" fill="#1DA1F2">
                                    <g>
                                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
                                    </g>
                                </svg>
                                <svg viewBox="0 0 24 24" className="checkmark hidden" id="gold" aria-label="Verified account" role="img" data-testid="icon-verified">
                                    <g>
                                        <path clipRule="evenodd" d="M8.52 3.59c.388-.568.908-1.032 1.515-1.353.607-.32 1.284-.488 1.97-.488.687 0 1.364.168 1.971.488.607.321 1.127.785 1.514 1.352.675-.127 1.37-.088 2.027.115.656.203 1.252.563 1.737 1.05.485.485.844 1.082 1.046 1.739.201.656.24 1.352.11 2.026.567.387 1.031.906 1.352 1.512.32.607.488 1.282.488 1.968 0 .686-.167 1.362-.488 1.968-.32.607-.785 1.126-1.352 1.512.13.675.091 1.37-.11 2.027-.202.656-.56 1.253-1.046 1.74-.485.485-1.081.846-1.737 1.048-.656.203-1.352.243-2.026.115-.388.567-.908 1.032-1.515 1.352-.607.32-1.284.489-1.97.489-.687 0-1.364-.168-1.971-.489-.607-.32-1.127-.785-1.515-1.352-.675.12-1.369.077-2.025-.124-.655-.202-1.253-.557-1.745-1.036-.477-.492-.83-1.09-1.032-1.745-.202-.656-.246-1.35-.128-2.025-.56-.393-1.018-.913-1.338-1.518-.32-.605-.492-1.277-.502-1.962.01-.684.182-1.356.502-1.961S3.03 8.913 3.59 8.519c-.12-.675-.077-1.37.124-2.025.202-.656.557-1.254 1.036-1.745.492-.478 1.09-.833 1.745-1.035.656-.202 1.35-.244 2.025-.125zm2.27 12.565l-3.74-3.74 1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" fill="url(#paint0_linear_7351_410156)" fillRule="evenodd"></path>
                                        <path clipRule="evenodd" d="M10.202 3.072c-.555.293-1.03.717-1.385 1.236-.618-.11-1.253-.07-1.852.114-.6.185-1.147.51-1.596.947-.438.449-.763.996-.948 1.596-.184.6-.223 1.234-.113 1.852-.512.36-.932.836-1.224 1.39-.293.552-.45 1.167-.459 1.793.009.626.166 1.24.459 1.794.292.553.712 1.03 1.224 1.389-.108.617-.068 1.252.116 1.851.185.6.508 1.147.945 1.597.45.438.996.762 1.596.947.6.184 1.234.223 1.852.114.354.519.83.943 1.385 1.236.556.294 1.174.447 1.803.447.628 0 1.246-.153 1.802-.447.555-.293 1.03-.717 1.385-1.236.617.116 1.253.08 1.854-.105.6-.186 1.145-.515 1.589-.96.443-.444.771-.99.956-1.59.184-.601.219-1.237.101-1.854.519-.354.943-.828 1.236-1.383.294-.555.447-1.173.447-1.8s-.153-1.245-.447-1.8c-.293-.555-.717-1.03-1.236-1.383.118-.617.083-1.253-.101-1.853-.184-.6-.513-1.147-.956-1.591-.444-.445-.99-.774-1.59-.96-.6-.185-1.236-.221-1.853-.105-.354-.519-.83-.943-1.385-1.236-.556-.294-1.174-.447-1.802-.447-.629 0-1.247.153-1.803.447zm.588 13.008l-3.74-3.74 1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" fill="#F9E87F" fillRule="evenodd"></path>
                                        <path clipRule="evenodd" d="M10.202 3.072c-.555.293-1.03.717-1.385 1.236-.618-.11-1.253-.07-1.852.114-.6.185-1.147.51-1.596.947-.438.449-.763.996-.948 1.596-.184.6-.223 1.234-.113 1.852-.512.36-.932.836-1.224 1.39-.293.552-.45 1.167-.459 1.793.009.626.166 1.24.459 1.794.292.553.712 1.03 1.224 1.389-.108.617-.068 1.252.116 1.851.185.6.508 1.147.945 1.597.45.438.996.762 1.596.947.6.184 1.234.223 1.852.114.354.519.83.943 1.385 1.236.556.294 1.174.447 1.803.447.628 0 1.246-.153 1.802-.447.555-.293 1.03-.717 1.385-1.236.617.116 1.253.08 1.854-.105.6-.186 1.145-.515 1.589-.96.443-.444.771-.99.956-1.59.184-.601.219-1.237.101-1.854.519-.354.943-.828 1.236-1.383.294-.555.447-1.173.447-1.8s-.153-1.245-.447-1.8c-.293-.555-.717-1.03-1.236-1.383.118-.617.083-1.253-.101-1.853-.184-.6-.513-1.147-.956-1.591-.444-.445-.99-.774-1.59-.96-.6-.185-1.236-.221-1.853-.105-.354-.519-.83-.943-1.385-1.236-.556-.294-1.174-.447-1.802-.447-.629 0-1.247.153-1.803.447zm.588 13.008l-3.74-3.74 1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" fill="url(#paint1_linear_7351_410156)" fillOpacity=".8" fillRule="evenodd"></path>
                                        <path d="M7.05 12.346v1.424l3.74 3.74 6.2-6.77V9.295l-.114-.085.114.106-6.2 6.77-3.74-3.74z" fill="#D18800"></path>
                                        <path d="M7.094 12.302l-.044.044v-.072l.044.028z" fill="#D18800"></path>
                                        <defs>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_7351_410156" x1="4.5" x2="22.8" y1="4.5" y2="23.4">
                                                <stop stopColor="#F4E72A"></stop>
                                                <stop offset=".474" stopColor="#CD8105"></stop>
                                                <stop offset=".602" stopColor="#CB7B00"></stop>
                                                <stop offset="1" stopColor="#F4EC26"></stop>
                                            </linearGradient>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_7351_410156" x1="5.14" x2="18.859" y1="5.141" y2="18.861">
                                                <stop stopColor="#F9E87F"></stop>
                                                <stop offset=".406" stopColor="#DCAB00"></stop>
                                                <stop offset=".989" stopColor="#DCAB00"></stop>
                                                <stop offset=".99" stopColor="#F9E87F"></stop>
                                            </linearGradient>
                                        </defs>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <button onClick={this.logout}>Logout</button>
                    </div>
                    <br></br>
                    <p id="checkmark-message" style={{ fontSize: 25 }} >Want a blue checkmark <br></br> next to your name?</p>
                    <p id="checkmark-message2" style={{ fontSize: 20 }}>Verify your email using the link <br></br> sent to you when you signed up <br></br> you can also resend the verification email. <br></br><br></br> After you click the link refresh the page <br></br>or click the "I've Verified" button.</p>
                    <button className='resendVerify' id="send-verify-email" onClick={this.resendVerification}>Resend Verification Email</button>
                    <button className='resendVerify' id="verify-button" onClick={this.checkVerified}>I've Verified</button>
                </div >
            );
        }
    }

    componentDidMount() {
        this.checkVerified();
    }
}

export default Main;