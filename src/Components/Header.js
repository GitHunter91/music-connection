import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import logo from '../assets/logo(white).png'
import axios from 'axios'

export default class Header extends Component {
    constructor(){
        super()
        this.state = {
            search: ''
        }
    }

    logout = () => {
        // api call to destroy and end session
        axios.get('/api/logout')
            // no necessary followup
            .then()
            // nothing to catch
            .catch()
        // return user to authorization component to log in again
        return window.location.href='/'
    }
    
    dropFunc = () => {
        // toggle between dropdown showing and not showing
        document.getElementById('dropdown').classList.toggle('show')
    }

    handleChange = (key, val) => {
        // allow for state value of search to be modified
        this.setState({
            [key]: val
        })
    }
    
    render() {
        /* console.log(this.props) */
        // render image from asset folder for logo ---- line 46
        // call logout method to end session and return user to authorization component ---- line 48
        // call dropFunc method to show/hide drop menu -- conditionally render link / label based on which component is currently rendered ---- line 51
        // allow user to update search parameters ---- line 53
        // conditionally render link/pathname based on which component is currently rendered ---- lines 54-55
        return (
            <div className='dash-container'>
                <div className='header'>
                    <div className='mini-logo'>
                        <img src={logo} alt='logo'/>
                    </div>
                        <div className='dash-log' onClick={ this.logout  }>Log Out</div>
            </div>
                <div className='drop'>
                    <button className='dropbtn' onClick={ this.dropFunc }>Search / {window.location.pathname !== "/Live" ? "Live" : "Dashboard"}</button>
                        <div id='dropdown' className='drop-content' >
                            <input className='search' type="text" placeholder='Search..' onChange={e=>this.handleChange('search',e.target.value)}/>
                            <Link to ={window.location.pathname === "/Live" ? "/Dashboard" : "/Live"}>{window.location.pathname === "/Live" ? "Dashboard" : "Live"}</Link>
                            {window.location.pathname === "/Chat" ? <Link to = "/Dashboard" >Dashboard</Link>: null}
                        </div>
                </div> 
            </div>           
        );
    }
}