// create initial state to be used by all components
const initialState = {
    auth_token: '',
    access_token: '',
    search: '',
    refresh_token: '',
    live: [],
    follows: [],
    users: [],
    name: '',
    bio:'',
    email:'',
    id: ''
}

// initialize types to get errors should a type occur ( **** OPTIONAL **** )
const SEND_CODE = "SEND_CODE"
const GET_OAUTH = "GET_OAUTH"
const GET_ACCESS = "GET_ACCESS"
const GET_REFRESH = "GET_REFRESH"
const GET_EMAIL = "GET_EMAIL"
const GET_USER = "GET_USER"
const GET_BIO = "GET_BIO"
const GET_ID = "GET_ID"
const GET_FOLLOWS = "GET_FOLLOWS"
const GET_LIVE = "GET_LIVE"
const NEW_BIO = "NEW_BIO"
const GET_USERS = "GET_USERS"


// set userID to state object
export const getID = (id) => {
    return {
            type: GET_ID,
            payload: id
    }
}

// set email to state object
export const getEmail = (email) => {
    return {
            type: GET_EMAIL,
            payload: email
    }
}

// set username to state object
export const getName = (user) => {
    return {
            type: GET_USER,
            payload: user
    }
}

// set bio to state object
export const getBio = (bio) => {
    return {
            type: GET_BIO,
            payload: bio
    }
}

// set oauth_token to state object
export const oauthToken = (auth) => {
    return {
            type: GET_OAUTH,
            payload: 'OAuth ' + auth
    }
}

// set access_token to state object
export const accessToken = (access) => {
    /* console.log('-----------access_token', initialState.access_token) */
    return {
            type: GET_ACCESS,
            payload: access
    }
}

// set refresh_token to state object
export const refreshToken = (refresh) => {
    return {
            type: GET_REFRESH,
            payload: refresh
    }
}

// set code to state object 
export const sendCode = (code) => {
    return {
        type: SEND_CODE,
        payload: code
    }
}

// set follows to state object
export const getFollows = (follows) => {
    return {
        type: GET_FOLLOWS,
        payload: follows
    }
}

// set live users to state object
export const getLive = (live) => {
    return {
        type: GET_LIVE,
        payload: live
    }
}

// update bio in state object
export const newBio = (bio) => {
    return {
        type: NEW_BIO,
        payload: bio
    }
}

// set all users in state object
export const getUsers = (users) => {
    return {
        type: GET_USERS,
        payload: users
    }
}


function reducer ( state=initialState, action ){

    switch ( action.type ){
        
        case SEND_CODE: 
        /* console.log('-------action', action) */
            return Object.assign( {}, state, { code: action.payload });

        case GET_OAUTH:
        /* console.log('-------action', action) */
            return Object.assign( {}, state, { auth_token: action.payload})

        case GET_ACCESS:
        /* console.log('-------action', action) */
            return Object.assign( {}, state, { access_token: action.payload })

        case GET_REFRESH:
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { refresh_token: action.payload })

        case GET_EMAIL: 
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { email: action.payload })

        case GET_USER: 
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { name: action.payload })

        case GET_BIO:
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { bio: action.payload })

        case GET_ID:
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { id: action.payload })

        case GET_FOLLOWS:
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { follows: action.payload })

        case GET_LIVE:
        /* console.log('--------action', action) */
        /* console.log('REDUCER LIVE: ', action.payload, state.live) */
               let index =  state.live.indexOf(action.payload)
                /* console.log(index) */
                    if( index === -1 ){ 
                        return ({...state, live: [...state.live, action.payload] })
                    } return state

        case NEW_BIO:
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { bio: action.payload })

        case GET_USERS:
        /* console.log('--------action', action) */
            return Object.assign( {}, state, { users: action.payload })

        default: 
            return state
    }
}

export default reducer