const axios = require('axios')

module.exports = {
    register: ( req, res ) => {
        /*console.log(req.body)*/
        // destructure the req.body
        const { display_name, email, bio, _id } = req.body
        // use initialize database in order to use sql calls with single word variable
        const database = req.app.get('db')
        // call add_user on initial login of user using necessary parameters
        database.add_user([ display_name, email, bio, _id ])
            .then( user => {
                // send user information to the front end
                res.status( 201 ).send(user)
            })
            .catch( err  => {
                // send error message if .then fails
                res.status( 500 ).json({ message: err.message })
            })
    },

    remove: ( req, res ) => {
        // set initialize database variable as database call
        const database = req.app.get('db')
        // destructure req.params
        const { id } = req.params
        // call database with necessary parameters
        database.unfollow([ id, followed_by ])
            .then( () => {
                // send 200 status and confirmation that correct user was removed from follows
                res.status( 200 ).send( console.log(`deleted from users id: ${id}`))
            })
            .catch( ()=>{
                // send 500 server error status
                res.status( 500 ).send()
            })
    },

    getSession: (req, res ) => {
        // gets the session information and sends it back
        res.status(200).send(req)
    },
    update: ( req, res ) => {
        // initialize variable to handle database calls
        const database = req.app.get('db')
        // destructure req.body 
        const { display_name, email, bio } = req.body
        // destructure req.params
        const { id } = req.params
            /* console.log('----------body', req.body) */
            // console.log('----------params', req.params)
                
                // make database call using proper parameters
                database.update_user([ display_name, email, bio ])
                    .then((user)=>{
                        // send back updated user to front end
                        res.status( 201 ).send(user[0])
                    })
                    .catch(()=>{
                        // send server error status 500
                        res.status( 500 ).send()
                    })
    },

    updateBio: ( req, res ) => {
        /* console.log(req.session.user) */
        
        // initialize database call variable
        const db = req.app.get('db')
        // destructure req.body
        const { bio } = req.body
        // destructure req.session.user
        const { id } = req.session.user
            // make database call to update bio, use '+' to parseInt the id variable
            db.update_bio([ +id, bio ])
                .then( user => {
                    // send 201 status if successful
                    res.status( 201 ).send()
                })
                .catch( () => {
                    // send 500 status if unsuccessful
                    res.status( 500 ).send()
                })
    },
    
    getUser: ( req, res ) => {
        /* console.log('---------test', req.session.user.id) */
        
        // make database call using '+' to parseInt the id
        req.app.get('db').get_user(+req.session.user.id)
        .then( user => {
            // return 200 status if successful and send the user information to the front end
            res.status( 200 ).json({ userData: user })
        })
        .catch( err => {
            // return error message if unsuccessful
            res.json({ message: err.message })
        })
    },
    
    
    getFollows: ( req, res ) => {
        // make database call to see who is following
        req.app.get('db').followedBy()
        .then( followed => {
            // return admin table
            res.json({ admins: admins })
        })
        .catch( err => {
            // return error message
            res.json({ message: err.message })
        })
    },
    
    redirect: ( req, res ) => {
        // initialize code as a variable for the code parameter
        const code = req.query.code
        /* console.log(code) */
        
        // make api call to twitch to get access token and refresh token
        axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=http://192.168.1.10:3000/auth/twitch/callback`)
        .then( response => {
            /* console.log(response.data) */
            /* console.log(req.session) */
            
            // place access_token and refresh_token into session to be accessible across application
            req.session.user.access_token = response.data.access_token
            req.session.user.refresh_token = response.data.refresh_token
            // create header object to send with API call for authentication
            const headers = { 
                "Accept" : "application/vnd.twitchtv.v5+json",
                "Client-id": "zmngsf0d8hkhs59ooy5z81ltb3x7o7",
                "Authorization": "OAuth "+`${response.data.access_token}`
            }
            // make api call to get user information of LOGGED IN USER
            axios.get('https://api.twitch.tv/kraken/user', {headers})
            .then( response => {
                // set session of logged in users ID / Display_name / email / and bio
                req.session.user.id = response.data._id
                req.session.user.username = response.data.display_name
                req.session.user.email = response.data.email
                req.session.user.bio = response.data.bio
                    // make database call using response ID
                    req.app.get('db').get_user(response.data._id)
                    .then( response2 => {
                        // if user ID does NOT already exist in database, perform next actions
                        if(response2.length === 0){
                            // add api response data to related fields in database
                            req.app.get('db').add_user(response.data.display_name, response.data.email, response.data.bio, response.data._id)
                            .then( response3 => {
                                // add same fields to session data to maintain proper session information
                                req.session.user.username = response.data.display_name
                                req.session.user.email = response.data.email
                                req.session.user.bio = response.data.bio
                            })
                        }else{
                            /* console.log('yay') */
                            // if user ALREADY exists in table after login, repopulate session information with existing user data
                            req.session.user.username = response2[0].display_name
                            req.session.user.email = response2[0].email
                            req.session.user.bio = response2[0].bio
                            /* console.log(req.session.user) */
                        }
                        /* console.log(req.query) */
                        // redirect user to LIVE page of application 
                        res.redirect('/Live')
                    })
                /* console.log() */
            })
        })
        .catch( err => {
            // log error should previous calls fail
            console.log(err)
        })
        // this.props.sendCode(code)
    },
    
    userData:  ( req, res ) => {
        /*  console.log(req.session) */
        // send session data to front end
        res.status( 200 ).send(req.session.user) 
    },
    
    refresh: ( req, res, next ) => {
        // make call to session to receive and update current session data
        axios.get('/api/userData')
        .then( response => {
            // set refresh token and access token to new values
            req.session.user.refresh_token = response.data.refresh_token
            req.session.user.access_token = response.data.access_token
            // res.status( 200 ).send( req.session.user )

            // make axios call using current refresh token to gain new refresh token when access token has expired
                axios.post(`https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${req.session.user.refresh_token}&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_CLIENT_SECRET}`)
                .then( response => {
                    /* console.log(response.data.refresh_token) */
                    // set session refresh and access tokens to newly received values
                    req.session.user.refresh_token = response.data.refresh_token
                    req.session.user.access_token = response.data.access_token
                    
                    // return newly updated session to front end
                    res.status( 200 ).send( req.session.user )
                })
                .catch( err => {
                    // log error if inner api call fails
                    console.log(err, 'oops')
                })
        })
        .catch( err => {
            // log error if outer api call fails
            console.log( err )
        })
        // console.log(req.session.user)
    },

    logout: (req, res ) => {
        // destroy session
        req.session.destroy()
        // send 200 status when session has ended
        res.status( 200 ).end()
        /* console.log(req.session) */
    },
    
    
    getUsers: ( req, res ) => {
        // make database call to get all users
        req.app.get('db').get_users()
            .then( users => {
                    // send users object to front end
                    res.json({ users })
                })
                .catch( err => {
                        // send error message if db call fails
                        res.json({ message: err.message })
                    })
    }, 

    isAdmin: ( req, res ) => { 
        /* console.log(req.session.user) */
        // initialize database as db call
        const database = req.app.get('db')
            // call database join to show users who are admins
            database.admin_join()
            .then( response => {
                // send user object in response to front end
                res.status( 201 ).json(response)
            })
            .catch( err  => {
                // set status 500 and send error message if database call fails
                res.status( 500 ).json({ message: err.message })
            })
    },

    deleteUser: ( req, res ) => {
        /* console.log(req.params) */
        // destructure req.params
        const { display_name } = req.params
        // initialize variable to hande database calls
        const database = req.app.get('db')
            // make database call to delete user specified in parameter
            database.delete_user(display_name)
                .then( () => {
                    /* console.log('hello') */
                    // set status 200 and send successfull deletion of user
                    res.status( 200 ).send(`Successfully deleted ${display_name}`)
                })
                .catch( err => {
                    /* console.log('bye felicia') */
                    // set status 500 and send error message if database call fails
                    res.status( 500 ).json({ message: err.message })
                })
    }
    
}