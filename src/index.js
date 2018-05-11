import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './redux/store'
import { BrowserRouter as BR } from 'react-router-dom'
import { Provider as PR } from 'react-redux'


ReactDOM.render(
// use Provider around browser router to be able to use redux ---- lines 12 & 16
// surrount App with Browser router to be able to use Link to go from component to component ---- lines 13 & 15
<PR store = { store } >
     <BR>
        <App />
    </BR>
</PR>,
 document.getElementById('root'))

 