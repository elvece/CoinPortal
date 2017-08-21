import React, { Component } from 'react';
import '../App.css';
import ExchangeTable from './ExchangeTable.js';

function calculatePurchase(){

}

class Abacus extends Component {
  constructor(props){
    super();
    this.state = ({
      exchangeRate: 0,
      exchange: '',
      amount: 0,
      minerFee: 0,
      exchangeFee: 0,
      total: 0,
      payment: '',
      coinAmount: 0,
      coin: '',
      totalFee: 0
    })
  }

  handleChange(){
    return function(e){
      this.setState({[e.target.name]: e.target.value});
    }.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    console.log('handling submit in abacus')
    //calculate total cost
    //return this total to set to state.total
  }


  render(){
    const abacus_data = this.state;
    const { amount, coinAmount, minerFee, exchangeFee, totalFee, total } = this.state;

    return (
      <div>
        <ExchangeTable abacus={abacus_data} onClick={() => this.handleSubmit()}/>
        <div className="mdl-grid Abacus-grid">
          <div className="mdl-cell mdl-cell--4-col mdl-cell--2-offset">
            <div className="mdl-card mdl-shadow--3dp">
              <div className="mdl-card__title mdl-card--border">
                <h2 className="mdl-card__title-text">Purchase Amount:</h2>
              </div>
              <div className="mdl-card__supporting-text">
                Enter the amount in USD that you would like to purchase:
                <form action="#">
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" name="amount" value={amount} onChange={this.handleChange()} type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="purchaseAmount"/>
                    <label className="mdl-textfield__label" htmlFor="purchaseAmount">How much do you want to invest...?</label>
                    <span className="mdl-textfield__error">Input is not a number!</span>
                  </div>
                </form>
              </div>
              <div className="mdl-card__actions">
                <button className="mdl-button mdl-button--accent mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                  Calculate!
                </button>
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <div className="mdl-card mdl-shadow--3dp">
              <div className="mdl-card__title mdl-card--border">
                <h2 className="mdl-card__title-text">Abacus Result:</h2>
              </div>
              <div className="Abacus-Result">
                {amount} USD > {coinAmount} BTC
              </div>
                <table className="mdl-card__supporting-text mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                  <thead>
                    <tr>
                      <th className="mdl-data-table__cell--non-numeric"></th>
                      <th className="mdl-data-table__cell--non-numeric">Fees</th>
                      <th className="mdl-data-table__cell--non-numeric">Investment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="mdl-data-table__cell--non-numeric">Miner</td>
                      <td>${minerFee}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="mdl-data-table__cell--non-numeric">Exchange</td>
                      <td>${exchangeFee}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="mdl-data-table__cell--non-numeric">Total</td>
                      <td>${totalFee}</td>
                      <td>${total}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Abacus;
