import React, { Component } from 'react';
import route from './route'
// import './styles/auth.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <div>
            { route }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
