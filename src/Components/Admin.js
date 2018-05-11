import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import '../styles/admin.css'
import {getUsers, getID} from '../redux/reducer'

class Admin extends Component {

    componentDidMount(){
        /* console.log('mounted') */
        // on load, users list is loaded from database
        this.loadUserInfo()
        // on load, current logged in user is checked against admin database
        this.checkForAdmin()

    }

    loadUserInfo = () => {
        // api call to check for all users in table
        axios.get('/api/getUsers')
        .then( response => {
            /* console.log(response.data.users) */
            // map through all users in database and retrieve ONLY usernames
            let names = response.data.users.map( e => {
                // return display_names for listing
                return e.display_name
            })
            /*console.log(names) */
            // set value of users to state object in reducer
            this.props.getUsers(names)
        })
        .catch( err => {
            // log error should api call fail
            console.log( err )
        })
        // api call to get user info for currently active user
            axios.get('/api/userData')
                .then( response => {
                    /* console.log('----------------response', response.data.id) */
                    // adding user ID to reducer
                    this.props.getID(+response.data.id)
                })
                .catch( err => {
                    // log error should api call fail
                    console.log( err )
                })
    }

    checkForAdmin = () => {
        // check database to see if user is listed in admin table
        axios.get('/api/isAdmin/')
         .then( response => {
            /* console.log(response.data[0].userid, this.props.id) */
            // check currently logged in userID against userID of known admin in user database
            if(response.data[0].userid === this.props.id){
                // if userID in db matches logged in user, return TRUE boolean
                return true

            }else{
                // if userID in db does NOT match logged in user, return FALSE boolean
                return false
            }
         })
         .catch( err => {
             // log error if api call fails
             console.log( err )
         })
    }

    deleteUser = (e) => {
        // delete user from database where parameter matches
        axios.delete(`/api/deleteUser/${e}`)
            .then( () => {
                // give alert when user has successfully been deleted from database
                alert('Successfully deleted User')
                // run loadUserInfo again to update list of potential users in database
                this.loadUserInfo()
            })
            .catch( err => {
                // log error should api call fail
                console.log( err )
            })
    }

    render() {
        /* console.log('words') */
        /* console.log(this.checkForAdmin)*/
        // create variable that holds value of mapped users object ( this will be rendered below )
        const usersList = this.props.users.map( e => {
            // creates a list of users with an X next to each user that allows that user to be deleted on click
            return <li key={e}>{e}<p onClick={() => this.deleteUser(e)}>x</p></li>
        })
        return (
            //conditionally render this information - should anyone other than an admin access this page - they will see a blank page! ---- line 98
            // place variable inside of { } in order to render properly ---- line 102
            <div className>
                <div>
                    {this.checkForAdmin ? 
                        <div>
                            <div className="admin">Admin Page</div>
                                <div className='list'>
                                        {usersList}
                                </div>
                        </div> : null }
                 </div>
            </div>
        );
    }
}

// map state from reducer to this component
const mapStateToProps = state => {
    return {
    users: state.users,
    id: state.id
    }
}
// connects reducer and necessary functions to this component 
export default connect(mapStateToProps, {getUsers, getID})(Admin)