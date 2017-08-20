import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import '../App.css';
import ExchangeTable from './ExchangeTable.js';
import AccountManager from './AccountManager.js';

class Main extends Component {

  /* TODO:
      (1) make ExchangeManager to handle getting/setting exchange data
      (2) pass data into ExchangeForm and ExchangeTable
      (3) refactor ExchangeForm and Exchange Table to handle data as props
  */

  render() {
    return (
      <main className="mdl-layout__content">
        <div className="page-content">
          <Switch>
            <Route path='/table' component={ExchangeTable}/>
            <Route path='/dashboard' component={AccountManager}/>
          </Switch>
        </div>
      </main>
    );
  }
}

export default Main;












