import React, { Component } from 'react';
import axios from 'axios'
import '../styles/dashboard.css'
import '../styles/header.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { refreshToken, accessToken, oauthToken, getName, getEmail, getBio, getID, getFollows, newBio } from '../redux/reducer'



class Dashboard extends Component {

    componentDidMount () {
        // load user information on render of component
        this.userInfo()
        // load list of followed users on render of component
        this.initiateFollow()
       
    }
    
    getFollowed = (access_token, count) => {
        /* console.log(this.props) */
        // create config object to be sent as body of axios call to twitch api
        const config = {
            headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-id': `${process.env.REACT_APP_TWITCH_CLIENT_ID}` , 'Authorization': `${access_token}`}
            }
            // twitch api call to get streams that are followed by the logged in user
            axios.get('https://api.twitch.tv/kraken/streams/followed', config)
                    .then(response =>  {
                        // initializes variable to hold value of returned streams
                        let streamInfo = response.data.streams
                        /* console.log( response.data.streams ) */

                        // map through streamInfo to get preview images of each stream ( this also includes display_name of each user! )
                        let previewNames = streamInfo.map( e => {
                            // return image values in array of arrays
                           return  e.preview
                        })
                        /* console.log( previewNames ) */

                        // map through previewNames to get individual values of each preview image and edit their sizes
                        let dashboardPics = previewNames.map(e => {
                            // returns user images with modified height / width using regex
                           return e.template.replace(/{width}x{height}/i, '1280x720')
                        })
                        // console.log(dashboardPics)

                        // map through picture url to get display_name
                        let dashboardNames = dashboardPics.map( e => {
                            // use substring to find the display_names of users and return them
                            return e.substring(52, e.lastIndexOf('-'))
                        })
                        /* console.log(dashboardNames) */

                        // restructure follows data to include picture variable AND display_name variable
                        const objStructure = []
                            // use for loop to iterate through streamInfo array
                            for( let i = 0; i < streamInfo.length; i++  ){
                                // objStructure variable at each index will include the matching picture url and display name
                                objStructure[i] = [dashboardPics[i], dashboardNames[i]]
                            }
            
                        // use ternary to check that objStructure exists, if it does add it to the reducer under Follows key
                         objStructure ? this.props.getFollows(objStructure) : null
                        // console.log(this.props.auth_token)
                    })
                    .catch( error =>{
                        // check to see whether api call gives 401 unauthorized error
                        if( error.response.status === 401 && count <= 4 ){ 
                            // if 401 unauthorized error is issues, make refresh api call to get new authorization tokens
                            axios.get('/api/refresh')
                                .then( response => {
                                    /* console.log(response) */
                                    // call function again with newly updated access_token, count is used to make sure that this is only attempted 4 times
                                    this.getFollowed('OAuth' + response.data.access_token, count++)

                                })
                                .catch( err => {
                                    // log error should refresh fail
                                    console.log ( 'oops' )

                                })
                        }else{
                            // log error should error other than 401 be given
                            console.log('Failed to Authenticate')

                        }
                            // log error of any other kind not caught by previous console logs
                            console.log( 'Authentication Error' )

                    })
    }

    initiateFollow = () => {
        // check to see if auth_token exists in the reducer state
        if(!this.props.auth_token){
            /* console.log( 'words' ) */

            // session call to get current users data
            axios.get('/api/userData')
                .then( response => {
                    // set current authorization token to value of access token
                    this.props.oauthToken(response.data.access_token)
                    /* console.log('-----words', this.props.access_token) */
                    /* console.log(this.props) */

                    // check to see the length of follows
                    if(this.props.follows.length === 0){
                        // if follows is 0, give the current access_token and reset the count parameter to 0
                        this.getFollowed('OAuth ' + response.data.access_token, 0)
                    }
                })
        }else{ 
            // check to see the length of follows when an auth token exists
            if(this.props.follows.length === 0 ){
                /* console.log('failed') */

                // if follows is 0, use current auth_token value and reset count to 0
                this.getFollowed(this.props.auth_token, 0)
            }
        }
    }

    userInfo = () => {
        // get user information from current session
        axios.get('/api/userData')
            .then( response => {
                /* console.log(response) */
                // set value of id, name, email, and bio in the reducer
                this.props.getID(response.data.id)
                this.props.getName(response.data.username)
                this.props.getEmail(response.data.email)
                this.props.getBio(response.data.bio)
                
            })
            .catch( err => {
                // if api call fails, log error
                console.log( err )
            })
        
    }

    updateBio = (e) => {
        // blocks in-line content updates
        e.target.contentEditable=false ; 
            // create variable to hold the value of the updated bio
            const bio = e.target.innerText
            /* console.log(bio) */
                // make database call to update the users bio
                axios.put('/api/updateBio/', bio)
                    .then( () => {
                        // update the bio in the reducer
                        this.props.newBio(bio)
                    })
                    .catch( err => {
                        // log error if api call fails
                        console.log( err )
                    })
    }

    render() {
    /* console.log(this.props) */
    /* console.log(this.props.follows) */
    // create variable to hold value of mapped follows array 
    const following = this.props.follows.map( (e,i) => {
        // return structure of mapped content
        // create a link behind the picture of each streamer ---- line 168
        // create a link to chat component based on the username ---- line 171
        // create a link to forum component based on the username ---- line 171 (**** currently not in place **** ) 
        return   <div key={i} className='vid'>
                        <div className='i'>
                            <a href={`https://twitch.tv/${e[1]}`} ><img src={e[0]} alt='streams'/> </a>
                        </div>
                            <div className='buttons'>
                                <Link className="twitch" to={{pathname: '/Chat', state:`${e[1]}`}}><button>Chat</button></Link>
                                <Link className="twitch" to='/forum'><button>Forum</button></Link>
                            </div>
                    </div>
    })
   /* console.log(following) */

    return (
        // pull image from url to be used as profile image for user ---- line 184
        // set username based on name of individual user that is logged in ---- line 186
        // set bio to editable on click and uneditable on blur, also saves the changed bio to user in database ---- line 187
        <div>
                <div className='profile'>
                    <img className='profile-pic' src='https://http.cat/202' alt='accepted' />
                        <div className='info'> 
                            <span className="about">Twitch Username: <span className='name'> {this.props.name}</span></span>
                            <p className='about' onClick={e => e.target.contentEditable=true} onBlur={e => this.updateBio(e)}>{this.props.bio}</p>
                        </div>
                </div>
                <div className='follow-bar'>
                    <div>CHANNELS YOU FOLLOW!</div>
                </div>
                <div className='lower'>
                    <div className='channels'>
                        {following}
                    </div>
            </div>
        </div>
      );
   }
}

// map state from reducer to props in current component
const mapStateToProps = state =>  {
    return {
        auth_token: state.auth_token,
        follows: state.follows,
        bio: state.bio,
        name: state.name
    }
}

// connect reducer functionality to this component
export default connect( (mapStateToProps),{ refreshToken, oauthToken, accessToken, getName, getEmail, getBio, getID, getFollows, newBio })(Dashboard)