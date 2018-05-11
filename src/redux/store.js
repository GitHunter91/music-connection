import { createStore } from 'redux'
import reducer from './reducer'

// create store variable to be used by redux - add in chrome devtools
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


export default store