import React, { Component } from 'react';
import '../App.css';
import ExchangeTable from './ExchangeTable.js';
import ExchangeForm from './ExchangeForm.js';


class Abacus extends Component {

  render(){

    return (
      <div>
        <ExchangeTable/>
        <ExchangeForm/>
      </div>
    );
  }
}

export default Abacus;

        // <div className="mdl-grid">
        //   <div className="mdl-cell mdl-cell--8-col mdl-cell--2-offset">
        //     <ExchangeTable/>
        //   </div>
        // </div>