import React, { Component } from 'react';
import './App.css';
import ExchangeForm from './components/ExchangeForm.js';
import ExchangeTable from './components/ExchangeTable.js';
import AccountManager from './components/AccountManager.js';
import { MdAllOut } from 'react-icons/lib/md';


class App extends Component {

  /* TODO:
      (1) make ExchangeManager to handle getting/setting exchange data
      (2) pass data into ExchangeForm and ExchangeTable
      (3) refactor ExchangeForm and Exchange Table to handle data as props
  */

  render() {
    return (
    <div>
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <MdAllOut className="App-header-icon"/>
            <span className="mdl-layout-title">CoinPortal</span>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation mdl-layout--large-screen-only">
              <a className="mdl-navigation__link" href="">Dashboard</a>
              <a className="mdl-navigation__link" href="">Table</a>
            </nav>
          </div>
        </header>
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Title</span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" href="">Link</a>
            <a className="mdl-navigation__link" href="">Link</a>
          </nav>
        </div>
        <main className="mdl-layout__content">
          <div className="page-content">
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--8-col mdl-cell--2-offset">
                <ExchangeTable/>
              </div>
            </div>
            <AccountManager/>
            <ExchangeForm/>
          </div>
        </main>
      </div>
    </div>
    );
  }
}

export default App;












