import React, { Component } from 'react';
import '../App.css';
import Client from '../Client';
import AccountManager from './AccountManager.js';
import CoinCard from './CoinCard.js';
import { MdSupervisorAccount, MdDataUsage, MdDashboard } from 'react-icons/lib/md';


class Dashboard extends Component {
    constructor(props){
    super(props);
    this.state = {
      loading: true,
      coins: []
    };

    this.getPrices = async () => {
      const res = await Promise.all([
        Client.getStuff(`/api/coins/price/bitcoin`),
        Client.getStuff(`/api/coins/price/ethereum`),
        Client.getStuff(`/api/coins/price/dash`),
        Client.getStuff(`/api/coins/price/litecoin`),
      ])
      this.setState({
        coins: res.flat(),
        loading: false
      });
    }
  }

  componentDidMount(){
    this.getPrices();
  }

  render() {
    const { coins, loading } = this.state;
    let coinData;

    if(!loading){
      coinData = coins.map((coin) => {
        return (
          <CoinCard key={coin.id} coin={coin}/>
        )
      })
    }

    return (
      <div>
        <div className="AccountHeader">
          <div className="mdl-grid Center-grid-content">{coinData}</div>
        </div>
        <h2 style={{textAlign: 'center', color: '#222'}}><MdSupervisorAccount/> <MdDashboard/> <MdDataUsage/></h2>
        <AccountManager prices={coins}/>
      </div>
    )
  }
}

export default Dashboard;