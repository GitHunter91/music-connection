module.exports = ( req, res, next ) => {
    // destructure req
    const { session } = req
    // if session.user does NOT exist, initialize one with default values
    if (! session.user ) {
        // setting all potential key value pairs
        session.user = { id: '' , username: '', email: '', access_token: '', refresh_token: '', bio: ''}
    }
    // move on to next function call
    next()
}