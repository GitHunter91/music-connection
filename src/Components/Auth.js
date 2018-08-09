import React, { Component } from 'react';
import '../styles/auth.css'
import logo from '../assets/logo.png'

export default class Auth extends Component {

    login = () => {

        // create variable to hold necessary scope for proper user interaction
        const scope = 'channel_read user_read user_follows_edit clips:edit user:edit user:read:email analytics:read:games openid'
        // redirects user to login page of twitch to be redirected back to music-connection application
        window.location = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=http://${window.location.origin}/auth/twitch/callback&response_type=code&scope=${scope}`
    
    }

    render() {
        return (
            // render logo image for web page useing { } to properly render ---- line 21
            // on click, users will be redirected to twitch login page where they can input their credentials and accept necessary permissions ---- line 22
            <div className='outside'>
                    <div className = 'logo' >
                        <img className ='foo' src={logo} alt='logo'/>
                        <button className='login' onClick={ this.login }>Log In With Twitch</button>
                    </div>
            </div>
        );
    }
}