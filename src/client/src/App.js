import React, { Component } from 'react';
import Client from "./Client";
import './App.css';
import ExchangeForm from './components/ExchangeForm.js';
import ExchangeTable from './components/ExchangeTable.js';
import AccountManager from './components/AccountManager.js';

class App extends Component {

  getData = () => {
    Client.getStuff(`api/exchanges/`).then(console.log('hi'));
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
        <ExchangeForm/>
        <ExchangeTable/>
        <AccountManager/>
      </div>
    );
  }
}

export default App;












