import React, { Component } from 'react';
import '../App.css';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/lib/md';
import ReactTooltip from 'react-tooltip';

class CoinCard extends Component {

  render() {
    const { coin } = this.props;
    let style_7;
    let style_24;
    let icon_7;
    let icon_24;
    let image;

    if(parseInt(coin.percent_change_24h, 10) > 0){
      //price has increased in last 24 hours
      style_7 = {color: '#1C6D65', fontSize: '32px'};
      icon_7 = <MdArrowDropUp/>;
    } else {
      style_7 = {color: '#892323', fontSize: '32px'};
      icon_7 = <MdArrowDropDown/>;
    }
    if(parseInt(coin.percent_change_7d, 10) > 0){
      //price has increased in last 7 days
      style_24 = {color: '#1C6D65', fontSize: '32px'};
      icon_24 = <MdArrowDropUp/>;
    } else {
      style_24 = {color: '#892323', fontSize: '32px'};
      icon_24 = <MdArrowDropDown/>;
    }

    //TODO actually query via api call
    if(coin.symbol === 'BTC'){
      image = 'https://shapeshift.io/images/coins/bitcoin.png';
    } else if (coin.symbol === 'ETH'){
      image = 'https://shapeshift.io/images/coins/ether.png';
    } else if (coin.symbol === 'LTC'){
      image = 'https://shapeshift.io/images/coins/litecoin.png';
    } else if (coin.symbol === 'DASH'){
      image = 'https://shapeshift.io/images/coins/dash.png';
    }

    return (
      <div key={coin.name} className="mdl-cell mdl-cell--3-col">
        <div className="coin-card-image mdl-card mdl-shadow--2dp">
          <div className="coin-card-title mdl-card__title mdl-card--expand">
            <span data-tip data-for="price_usd" style={style_7}>{icon_7} {coin.price_usd}</span>
            <ReactTooltip id="price_usd">Current price (24 hr change)</ReactTooltip>
            <img style={{padding: '5px'}} src={image} alt={coin.name}/>
            <span data-tip data-for="percent_change_7d" style={style_24}>{icon_24} {coin.percent_change_7d}</span>
            <ReactTooltip id="percent_change_7d">Percent Change (7 day)</ReactTooltip>
          </div>
          <div className="mdl-card__actions">
            <span className="coin-card-name">{coin.name}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CoinCard;