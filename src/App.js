import React, { Component } from 'react';
import './App.css';
//import ReactScene from './components/ReactScene';
import ReactMap from './components/ReactMap';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <ReactScene /> */}
        <ReactMap />
      </div>
    );
  }
}

export default App;