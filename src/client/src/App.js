import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Main from './components/Main.js';

class App extends Component {

  render() {
    return (
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header />
      <Main />
    </div>
    );
  }
}

export default App;












