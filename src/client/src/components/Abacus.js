import React, { Component } from 'react';
import '../App.css';
import ExchangeTable from './ExchangeTable.js';
import HorizontalLinearStepper from './LinearStepper.js';
import { MdCompareArrows, MdArrowForward, MdMonetizationOn } from 'react-icons/lib/md';
import Client from '../Client';
import CircularProgress from 'material-ui/CircularProgress';

const SHAPESHIFT = 'ShapeShift';
// TODO: make api call to get this data
// USD averages from https://bitinfocharts.com/comparison/transactionfees-btc-eth-ltc-dash.html as of 08-29-2017
const minerFees = {
  btc: 7.351,
  eth: 0.473,
  ltc: 0.170,
  dash: 0.285
}

function setMinerFee(exchange, price, coin){
  let result;
  exchange.coinData.forEach((item) => {
    if(item.name.toLowerCase() === coin){
      if(exchange.name ===  SHAPESHIFT){
        //maintain USD converted price
        result = item.minerFee ? (item.minerFee * parseFloat(price)): minerFees[coin];
      } else {
        result = item.minerFee ? (item.minerFee * parseFloat(item.price)): minerFees[coin];
      }
    }
  })
  return result.toFixed(5);
}

function setExchangeFee(exchange){
  let result = 0;
  //account for what I defaulted for ShapeShift ie 'Miner Fee'
  if(exchange.withdrawalFee && exchange.withdrawalFee !== 'Miner Fee'){
    result = parseFloat(exchange.withdrawalFee) / 100;
  }
  return result.toFixed(3);
}


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
      coinPrice: undefined,
      coinData: [],
      loading: true
    })
    this.getCurrentBtcPrice = () => {
      const _this = this;
      Client.getStuff(`/api/coins/price/bitcoin`, function(result){
        _this.setState({
          coinData: _this.state.coinData.concat([result[0]]),
          loading: false
        });
      })
      Client.getStuff(`/api/coins/price/ethereum`, function(result){
        _this.setState({
          coinData: _this.state.coinData.concat([result[0]]),
          loading: false
        });
      })
    };
  }

  componentDidMount(){
    this.getCurrentBtcPrice();
  }

  processTableData = (price, coin, exchange, payment) => {
    //TODO need to get payment to incorporate into this calculation
    this.setState({
      exchange: exchange && exchange.name ? exchange.name : '',
      minerFee: exchange ? setMinerFee(exchange, price, coin) : 0,
      exchangeFee: exchange ? setExchangeFee(exchange) : 0,
      coinPrice: price ? price : '',
      coin: coin ? coin.toUpperCase() : '',
      payment: payment
    });
  }

  handleChange(){
    //TODO handle notifying user of disabled input until price selected
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
    const { amount, coinData, coin, coinPrice, minerFee, exchangeFee, loading } = this.state;
    const totalExchangeCost = amount ? (parseFloat(amount) * exchangeFee) : 0;
    //calculate the total fee sum
    const totalFee = amount ? (totalExchangeCost + parseFloat(minerFee)).toFixed(2) : 0;
    //calculate the amount of coins being purchased with entered amount and selected rate
    const coinAmount = coinPrice ? (amount / coinPrice).toFixed(5) : 0;
    const total = amount - totalFee;
    let exchangeTable;

    if(!loading){
      exchangeTable = <ExchangeTable calculate={this.processTableData} coinData={coinData}/>;
    } else {
      exchangeTable = <CircularProgress size={80} thickness={5}/>
    }

    return (
      <div>
        {exchangeTable}
        <HorizontalLinearStepper price={coinPrice} amount={amount} clear={this.handleClearAmount}/>
        <div className="mdl-grid Center-grid-content">
            <div className="mdl-card mdl-shadow--3dp">
              <div className="mdl-card__title mdl-card--border">
                <h2 className="mdl-card__title-text">Purchase Amount:</h2>
              </div>
              <div className="mdl-card__supporting-text">
                Enter the amount in USD that you would like to spend:
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
                    <label className="mdl-textfield__label" htmlFor="purchaseAmount"></label>
                    <span className="mdl-textfield__error">Input is not a number!</span>
                  </div>
                  <div style={{textAlign: 'center'}}><MdMonetizationOn style={{fontSize: '100px'}}/></div>
                </form>
              </div>
            </div>
          <div style={{textAlign: 'center', color: '#892323'}}>
            <MdCompareArrows style={{fontSize: '150px'}}/>
          </div>
            <div className="mdl-card mdl-shadow--3dp">
              <div className="mdl-card__title mdl-card--border">
                <h2 className="mdl-card__title-text">Abacus Result:</h2>
              </div>
              <div className="Abacus-Result">
                {amount ? amount : 0} USD <MdArrowForward/> {coinAmount } {coin}
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
                      <td>${totalExchangeCost}</td>
                      <td></td>
                    </tr>
                    <tr className="Abacus-Total">
                      <td className="mdl-data-table__cell--non-numeric">Total</td>
                      <td>${totalFee}</td>
                      <td>${total}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </div>
      </div>
    );
  }
}

export default Abacus;
