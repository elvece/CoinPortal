import React, { Component } from 'react';
import '../App.css';
import {Doughnut} from 'react-chartjs-2';

class AccountChart extends Component {

  render(){
    const account = this.props.account;
    const prop_wallets = this.props.account.wallets;
    const wallets = prop_wallets && prop_wallets.length > 0 ? prop_wallets.map((wallet, i) => {
      return (
        <p key={i}>{wallet.coin}: {wallet.address}</p>
      )
    }) : []
    const data = {
      labels: [
        'Red',
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ]
      }]
    };

    return (
      <div>
        <p>{account.name}</p>
        <p>{account.username}</p>
        {wallets}
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.props.onClick}>Update</button>
        <div>
        <Doughnut data={data} />
        </div>
      </div>
    );
  }
}

export default AccountChart;