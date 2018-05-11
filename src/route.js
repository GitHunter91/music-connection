import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Auth from './Components/Auth'
import Chat from './Components/Chat'
import Live from './Components/Live'
import Header from './Components/Header'
import Admin from './Components/Admin'



export default (
    // wrap routes with browser router to force routes 
    // conditionally render Header for when user is on authorization page ---- line 17
    <BrowserRouter>
        <div>
            {window.location.pathname === "/"  ?  null : <Header/> }
            <Route exact path='/' component={ Auth }/>
            <Route path='/Chat' component={ Chat }/>
            <Route path='/Dashboard' component={ Dashboard }/>
            <Route path='/Live' component={ Live } />
            <Route path='/Admin' component={ Admin } />
        </div>
    </BrowserRouter>
)