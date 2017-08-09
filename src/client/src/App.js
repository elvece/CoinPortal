import React, { Component } from 'react';
import Client from "./Client";
import './App.css';

class App extends Component {

  getData = () => {
    Client.search().then(console.log('hi'));
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>CoinPortal</h2>
        </div>
        <p className="App-intro">
          Exchange Table
        </p>
        <button onClick={() => this.getData()}>Click me</button>
      </div>
    );
  }
}

export default App;
