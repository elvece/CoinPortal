import React, { Component } from 'react';
import '../App.css';
import { Doughnut } from 'react-chartjs-2';

class AccountChart extends Component {

  render(){
    const account = this.props.account;
    const prop_wallets = this.props.account.wallets ? this.props.account.wallets.map((wallet) => {
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

    //temp values TODO connect with coincap price for each
    const btcPrice = 4100;
    const dashPrice = 290;
    const ethPrice = 315;
    const ltcPrice = 46;
    const chartData = calculcateDataset() ? calculcateDataset() : {};


    function calculcateDataset(){
      let chartData = {
        labels: [
          'Gains',
          'Losses',
          'Original Investment'
        ],
        datasets: []
      };

      prop_wallets.forEach((wallet) => {
        let currentValue = 0;
        let diff = 0;
        let dataObj = {
          data: [],//0 = gains, 1 = losses, 2 = current value of holding - for chart colors
          backgroundColor: [
            '#1C6D65',
            '#E2B761',
            '#224D7F'
          ],
          hoverBackgroundColor: [
            '#258E84',
            '#FFCE6D',
            '#3D6EA5'
          ]
        }
        //calculate current value based on current coin price
        if(wallet.coin === 'BTC'){
          currentValue = wallet.totalCoinAmount * btcPrice;
        } else if(wallet.coin === 'ETH'){
          currentValue = wallet.totalCoinAmount * ethPrice;
        } else if(wallet.coin === 'LTC'){
          currentValue = wallet.totalCoinAmount * ltcPrice;
        } else if(wallet.coin === 'DASH'){
          currentValue = wallet.totalCoinAmount * dashPrice;
        }
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
      return chartData;
    }

    return (
      <div>
        <p>{account.name}</p>
        <p>{account.username}</p>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.props.onClick}>Update</button>
        <div>
        <Doughnut data={chartData}/>
        </div>
      </div>
    );
  }
}

export default AccountChart;