import React, { Component } from 'react';
import '../App.css';
import Client from '../Client';
import AccountManager from './AccountManager.js';
import CoinCard from './CoinCard.js';


class Dashboard extends Component {
    constructor(props){
    super(props);
    this.state = {
      loading: true,
      coins: []
    };

    //TODO reafactor into one method so DRY and chain as promises

    this.getCurrentBtcPrice = () => {
      const _this = this;
      Client.getStuff(`/api/coins/price/bitcoin`, function(result){
        _this.setState({
          coins: _this.state.coins.concat([result[0]])
        });
      })
      this.getCurrentEthPrice();
    };

    this.getCurrentEthPrice = () => {
      const _this = this;
      Client.getStuff(`/api/coins/price/ethereum`, function(result){
        _this.setState({
          coins: _this.state.coins.concat([result[0]])
        });
      })
      this.getCurrentDashPrice();
    };

    this.getCurrentDashPrice = () => {
      const _this = this;
      Client.getStuff(`/api/coins/price/dash`, function(result){
        _this.setState({
          coins: _this.state.coins.concat([result[0]])
        });
      })
      this.getCurrentLtcPrice();
    };

    this.getCurrentLtcPrice = () => {
      const _this = this;
      Client.getStuff(`/api/coins/price/litecoin`, function(result){
        _this.setState({
          coins: _this.state.coins.concat([result[0]]),
          loading: false
        });
      })
    };
  }

  componentDidMount(){
    this.getCurrentBtcPrice();
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
        <div className="mdl-grid Center-grid-content">{coinData}</div>
        <AccountManager prices={coins}/>
      </div>
    )
  }
}

export default Dashboard;