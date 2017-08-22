import React, { Component } from 'react';
import '../App.css';
import ExchangeTable from './ExchangeTable.js';
import HorizontalLinearStepper from './LinearStepper.js';
import { MdCompareArrows } from 'react-icons/lib/md';

class Abacus extends Component {
  constructor(props){
    super();
    this.state = ({
      exchangeRate: 0,
      exchange: '',
      amount: '',
      minerFee: 0,
      exchangeFee: 0,
      payment: '',
      coin: 'BTC',
      coinPrice: undefined
    })
  }

  processTableData = (price, coin, exchange, payment) => {
    //TODO need to get payment

    //TODO: make api call to get this data
    const minerFees = {
      btc: 0.01,
      eth: 0.01,
      ltc: 0.01,
      dash: 0.01
    }

    //TODO need to see if exchange rate is calculated against USD or BTC (ie shapeshift & poloniex)

    //TODO need to account exchange feefor shapeshift

    this.setState({
      exchange: exchange && exchange.name ? exchange.name : '',
      minerFee: exchange && exchange.minerFee ? exchange.minerFee : minerFees[coin],
      // exchangeFee: exchange.withdrawalFee ? exchange.withdrawalFee : 0,
      exchangeFee: 0.25,
      coinPrice: price ? price : '',
      coin: coin ? coin.toUpperCase() : '',
      payment: payment
    });
  }

  handleChange(){
    //TODO disable input until processTableData sets state vars
    return function(e){
      //TODO regex for amount and ensure number
      this.setState({[e.target.name]: e.target.value});
    }.bind(this);
  }

  handleClearAmount = () => {
    this.setState({
      amount: ''
    });
  }

  render(){
    const { amount, coin, coinPrice, minerFee, exchangeFee } = this.state;
    //calculate total fees against purchase amount
    const totalMinerCost = this.state.amount * (this.state.minerFee * 0.01);
    const totalExchangeCost = this.state.amount * (this.state.exchangeFee * 0.01);
    //calculate the total fee sum
    const totalFee = (totalExchangeCost + totalMinerCost).toFixed(3);
    //calculate the amount of coins being purchased with entered amount and selected rate
    const coinAmount = coinPrice ? (amount / coinPrice).toFixed(5) : 0;
    const total = amount + totalFee;

    return (
      <div>
        <ExchangeTable calculate={this.processTableData}/>
        <HorizontalLinearStepper price={coinPrice} amount={amount} clear={this.handleClearAmount}/>
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
                    <input
                      className="mdl-textfield__input"
                      disabled={ coinPrice ? '' : 'disabled'}
                      name="amount"
                      value={amount}
                      onChange={this.handleChange()}
                      type="number"
                      pattern="-?[0-9]*(\.[0-9]+)?"
                      id="purchaseAmount"/>
                    <label className="mdl-textfield__label" htmlFor="purchaseAmount">How much do you want to invest...?</label>
                    <span className="mdl-textfield__error">Input is not a number!</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <div className="mdl-card mdl-shadow--3dp">
              <div className="mdl-card__title mdl-card--border">
                <h2 className="mdl-card__title-text">Abacus Result:</h2>
              </div>
              <div className="Abacus-Result">
                {amount ? amount : 0} USD <MdCompareArrows/> {coinAmount } {coin}
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
