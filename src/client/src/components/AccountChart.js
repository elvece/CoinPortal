import React, { Component } from 'react';
import '../App.css';
import { Doughnut } from 'react-chartjs-2';

class AccountChart extends Component {

  render(){
    const { account, prices } = this.props;
    const BTC = 'BTC';
    const ETH = 'ETH';
    const LTC = 'LTC';
    const DASH = 'DASH';
    const coinMap = extractPrices();

    const prop_wallets = account.wallets ? account.wallets.map((wallet) => {
      let totalCoinAmount = 0;
      let totalOgValue = 0;
      // NOTE using for each for readability, when scale, use for loop for performance
      wallet.rates.forEach((tx) => {
        totalCoinAmount += tx.amount;// add all transactions amounts together for total coin amount
        totalOgValue += (tx.rate * tx.amount)// multiply to get the original purchase value
      })
      return {
        coin: wallet.coin,
        totalCoinAmount: totalCoinAmount,
        totalOgValue: totalOgValue
      };
    }) : [];

    const displayCurrentCoinValues = prop_wallets.length > 0 ? prop_wallets.map((wallet) => {
      let currentVal = calculateCurrentValue(wallet);
      if(wallet.totalOgValue > currentVal){
        return (
          <li key={wallet.totalCoinAmount.toString()}>{wallet.coin} : <span style={{color: '#892323'}}>${numberWithCommas(Math.round(currentVal * 1e2) / 1e2)}</span></li>
        )
      } else {
        return (
          <li key={wallet.totalCoinAmount.toString()}>{wallet.coin} : <span style={{color: '#1C6D65'}}>${numberWithCommas(Math.round(currentVal * 1e2) / 1e2)}</span></li>
        )
      }
    }) : [];

    function calculateCurrentValue(wallet){
      let currentValue = 0;
      if(wallet.coin === BTC){
          currentValue = wallet.totalCoinAmount * coinMap[BTC].price_usd;
        } else if(wallet.coin === ETH){
          currentValue = wallet.totalCoinAmount * coinMap[ETH].price_usd;
        } else if(wallet.coin === LTC){
          currentValue = wallet.totalCoinAmount * coinMap[LTC].price_usd;
        } else if(wallet.coin === DASH){
          currentValue = wallet.totalCoinAmount * coinMap[DASH].price_usd;
        }
        return currentValue;
    }

    function calculcateDataset(){
      let chartData = {
        labels: [
          'Gains',
          'Losses',
          'Original Investment'
        ],
        datasets: []
      };

      if(prop_wallets && prop_wallets.length > 0){
        prop_wallets.forEach((wallet) => {
          let currentValue = 0;
          let diff = 0;
          let dataObj = {
            data: [],//0 = gains, 1 = losses, 2 = current value of holding - for chart colors
            backgroundColor: [
              '#1C6D65',
              '#892323',
              '#B7B6B3'
            ],
            hoverBackgroundColor: [
              '#258E84',
              '#FFCE6D',
              '#CECDCA'
            ]
          }
          //calculate current value based on current coin price
          currentValue = calculateCurrentValue(wallet);
          //set final data value to total original investments
          dataObj.data[2] = Math.round(wallet.totalOgValue * 1e2) / 1e2;
          //calculate gain or loss of investment
          diff = currentValue - wallet.totalOgValue;

          if(diff < 0){//loss
            dataObj.data[1] = Math.round(diff * 1e2) / 1e2;
            dataObj.data[0] = 0;
          } else {//gain
            dataObj.data[0] = Math.round(diff * 1e2) / 1e2;
            dataObj.data[1] = 0;
          }
          chartData.datasets.push(dataObj);
        })
      }
      return chartData;
    }

    function extractPrices(){
      let coinMap = {};
      prices.forEach((coin) => {
        coinMap[coin.symbol] = coin;
      })
      return coinMap;
    }

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const chartData = calculcateDataset() ? calculcateDataset() : {};

    return (
      <div className="mdl-cell mdl-cell--3-col">
        <div className="mdl-card mdl-shadow--3dp">
          <div className="mdl-card__title mdl-card--border">
            <h2 className="mdl-card__title-text">{account.name}</h2>
            <ul className="AccountValues">{displayCurrentCoinValues}</ul>
          </div>
          <div className="mdl-card__supporting-text">
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <Doughnut width={30} height={30} data={chartData} options={{maintainAspectRatio: true}}/>
            </div>
            <div className="mdl-card__actions mdl-card--border" style={{textAlign: 'right'}}>
              <button className="mdl-button mdl-button--accent mdl-button mdl-js-button mdl-button--raised mdl-button--colored" style={{marginTop: '5px'}} onClick={() => alert('Coming Soon!')}>Add Coins</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountChart;


// <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.props.onClick}>Update</button>

