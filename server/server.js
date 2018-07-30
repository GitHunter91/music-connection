// require necessary dependencies
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const bodyParser = require('body-parser')
const uCtrl = require('./uCtrl')


// session middleware to intialize session
const checkForSession = require('./checkForSession')

// initialize variable as express call
const app = express()

// use body-parser 
app.use( bodyParser.json() )

// set values for session
app.use( session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 24 * 14 * 1000
    }
}))
// use session middleware
app.use( checkForSession )

// used to access and make changes to the database
massive(process.env.CONNECTION_STRING)
.then(database=>{
    app.set('db',database)
});

// register new user in database
app.post('/api/register', uCtrl.register)

// delete follower from follower table in database
app.delete('/api/remove/:id', uCtrl.remove)

// delete user from user table in database
app.delete('/api/deleteUser/:display_name', uCtrl.deleteUser)

// update entire user in database
app.put('/api/update/:id', uCtrl.update)

// get currently logged in user
app.get('/api/getUser', uCtrl.getUser)

// used to return information from initial login to front end
app.get('/auth/twitch/callback', uCtrl.redirect)

// get user table information for session
app.get('/api/userData', uCtrl.userData)

// refreshes session information should the access token become invalid
app.get('/api/refresh', uCtrl.refresh)

// update user bio should they want a separate bio from their current twitch bio
app.put('/api/updateBio/', uCtrl.updateBio)

// log user out of sessions & destroy session
app.get('/api/logout', uCtrl.logout)

// get current session data for logged in user
app.get('/api/getSession',uCtrl.getSession)

// check to see if logged in user is Admin or not ( used for admin page conditional render )
app.get('/api/isAdmin/', uCtrl.isAdmin)

// gets list of all users that have logged into the site ( used for admin page conditional render )
app.get('/api/getUsers', uCtrl.getUsers)



// set port that application will be running on
const port = 3050
app.listen(port, () => {
    // allows user to see in terminal that the application is indeed working on the specified port
    console.log(`Server listening on port ${port}`)
})

