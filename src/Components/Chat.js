import React, { Component } from 'react';
import '../styles/chat.css'
import '../styles/header.css'


export default class Chat extends Component {

    render() {
        /*console.log(this.props) */
        // render video of selected user using state passed via link from Live / Dashboard page ---- line 16
        // render chat of selected user using state passed via link from Live / Dashboard page ---- line 26
        return (
            <div className='dash-container'>
                    <div className='chat-vid'>
                        <iframe title='7'
                            src={`http://player.twitch.tv/?channel=${this.props.location.state}&muted=false`}
                            frameborder="0"
                            scrolling="no"
                            allowfullscreen="true">
                        </iframe>
                    </div>
                    <div className='chat'>
                        <iframe title='8'
                            frameborder="0"
                            scrolling="yes"
                            src={`http://www.twitch.tv/embed/${this.props.location.state}/chat`}>
                        </iframe>
                    </div>
            </div>
        );
    }
}