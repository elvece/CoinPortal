import React, { Component } from 'react';
import '../App.css';

class AccountChart extends Component {

  render(){
    const account = this.props.account;
    const prop_wallets = this.props.account.wallets;
    const wallets = prop_wallets && prop_wallets.length > 0 ? prop_wallets.map((wallet, i) => {
      return (
        <p key={i}>{wallet.coin}: {wallet.address}</p>
      )
    }) : []

    return (
      <div>
        <p>{account.name}</p>
        <p>{account.username}</p>
        {wallets}
      </div>
    );
  }
}

export default AccountChart;