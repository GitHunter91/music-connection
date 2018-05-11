import React, { Component } from 'react';
import axios from 'axios'
import '../styles/header.css'
import '../styles/live.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { accessToken, refreshToken, oauthToken, getLive, getID} from '../redux/reducer'

class Live extends Component {

    componentDidMount(){
        // get names of live streamers from twitch API
        this.getNames()
        // get current user session data
        axios.get('/api/userData')
            .then( response => {
            /* console.log( response )  */

                // set user session information to state in reducer
                this.props.getID( response.data.id )
                /* console.log( this.props.id ) */
                this.props.accessToken( response.data.access_token )
                /* console.log( this.props.access_token ) */
                this.props.oauthToken( response.data.access_token )
                /* console.log( this.props.auth_token ) */
                this.props.refreshToken( response.data.refresh_token )
                /* console.log( this.props.refresh_token ) */
        })
        /* console.log(this.props.location) */
    }

    getNames = () => {  
        // create variable to hold values of body to be sent with api call
        const config = {
                headers: {'Client-id':`${process.env.REACT_APP_TWITCH_CLIENT_ID}` }
            }
            /* console.log('-----headers', process.env.REACT_APP_TWITCH_CLIENT_ID ) */

            // api call to get users based on game id
            axios.get('https://api.twitch.tv/helix/streams?first=100&game_id=26936', config)
                .then( response => {
                    // set initial value of response information 
                    const isLive = response.data.data
                    /* console.log(response.data.data) */
                    /* console.log(isLive) */

                    // map through initial response and modify height and width of img
                    const thumbnail = isLive.map(e => {
                        // use .replace to modify the size of images
                        return e.thumbnail_url.replace(/{width}x{height}/i,'1280x720')

                    })
                    /* console.log(thumbnail) */

                    // map through initial response and find display_name inside of image url
                    const names = isLive.map(e => {
                        // use substring to find display_name between two index parameters
                        return e.thumbnail_url.substring(52, e.thumbnail_url.lastIndexOf('-'))
                        
                    })
                    /* console.log(names) */

                    // restructure live users object
                    const dataStructure = []
                        // iterate through isLive array
                        for(let i = 0; i < isLive.length; i++){
                            // add the image url and display_name as indexes 0 and 1 of the dataStructure array
                            dataStructure[i] = [thumbnail[i], names[i]]
                        }
                            // does dataStructure exist? if it does, push that array to the live value of the reducer
                            dataStructure ? this.props.getLive(dataStructure) : null 
                            /* console.log(this.props.live) */
                })
                .catch( function (error ) {
                    console.log( error )
                })
    }
 
    render() {
        // create variable to hold the value of the mapped 'live' array from the reducer
        const display = this.props.live.map( e => {
            return e.map( a => {
                /* console.log(a) */
                // create link behind image using the name from index 1 in each element && add image using index 0 in each element  ---- line 89
                // create link to chat passing in the current state of the user clicked where the name from index 1 will be used ---- line 91
                return <div className='vid' >
                                <div className='i' >
                                        <a href={`https://twitch.tv/${a[1]}`}><img src={a[0]} alt='stream'/></a>
                                </div>
                                    <div className='buttons'>
                                            <Link to={{pathname: '/Chat', state:`${a[1]}`}}><button>Chat</button></Link>
                                            <button>Forum</button>
                                    </div>
                          </div>
                            
        })   
    })
        /* console.log(displayNames) */
        // render the display variable using { } to use javascript inside of JSX ---- line 104
        return (
            <div>
                <div className='lower'>
                    <div className='channels2'>
                        { display }
                    </div>
                </div>
            </div>
        )
    }
}

// map the values from the reducer state to be used by the component
const mapStateToProps = state => {
    return {
    live: state.live,
    auth_token: state.auth_token,
    id: state.id
    }
}

// connect the reducer to the current component 
 export default connect(mapStateToProps, {accessToken, refreshToken, oauthToken, getLive, getID})(Live)