import React, { Component } from 'react';
import Client from "./Client";
import './App.css';
import update from 'immutability-helper';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class App extends Component {

  getData = () => {
    Client.getStuff(`api/exchanges/`).then(console.log('hi'));
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>CoinPortal</h2>
        </div>
        <p className="App-intro">
          Exchange Table
        </p>
        <button onClick={() => this.getData()}>Click me</button>
        <ExchangeForm></ExchangeForm>
      </div>
    );
  }
}

class ExchangeForm extends Component {
  constructor(props){
    super(props);
    this.state = {name: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    this.setState({name: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    this.setState({name: ''});
    Client.postStuff(`api/exchanges/`, this.state);
  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.name} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <ExchangeTable/>
      </div>
    );
  }
}

class ExchangeTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      exchanges: [{coinData: []}]
    };
    this.handleUpdateExchange = this.handleUpdateExchange.bind(this);
  }
  componentDidMount(){
    const _this = this;
    this.serverRequest = Client.getStuff(`api/exchanges/`, function(result){
        _this.setState({
          exchanges: result
        });
      })
  }
  handleUpdateExchange = (row, index) => {
    // persist this for use in callback function
    const _this = this;
    // temp data for simulating form update
    const data = {
      name: 'lvcEx2',
      coinData: [
        {
          // _id:'599096e1b30477a081a26e89', //lvcEx
          _id:'5990d89be937d9aa5f0f3fe1', //lvcEx2
          name: 'BTC',
          url: 'https://api.gemini.com/v1/pubticker/btcusd',
          price: 4100
        },
        {
          // _id: '599096e1b30477a081a26e8a', //lvcEx
          _id: '5990d89be937d9aa5f0f3fe2', //lvcEx2
          name: 'ETH',
          url: 'https://api.gemini.com/v1/pubticker/ethusd',
          price: 410
        }
      ]
    };
    Client.putStuff(`api/exchanges/`+row._id, data, function(result){
      // use update to persist state immutability - update certain exchange coinData with result
      const updatedExchange = update(row, {coinData: {$set: result.coinData}});
      // replace certain exchange with updated exchange data
      const newExchanges = update(_this.state.exchanges, {$splice: [[index, 1, updatedExchange]]})
      // set state with updated exchanges, leaving original state record
      _this.setState({
        exchanges: newExchanges
      })
    });
  }

  render(){
    const { exchanges } = this.state;

    function getCoinPrice(data, name){
      let output = '--';
      data.coinData.forEach((coin) => {
        if(coin.name === name){
          output = coin.price;
        }
      })
      return output;
    }

    const columns = [{
      Header: 'Name',
      columns: [{
        Header: '<>',
        accessor: 'name',
      }]
    },
    {
      Header: 'Coin Prices',
      columns: [
        {
          Header: 'BTC',
          id: 'btc',
          accessor: data => getCoinPrice(data, 'BTC')
        },
        {
          Header: 'ETH',
          id: 'eth',
          accessor: data => getCoinPrice(data, 'ETH')
        },
        {
          Header: 'LTC',
          id: 'ltc',
          accessor: data => getCoinPrice(data, 'LTC')
        },
        {
          Header: 'DASH',
          id: 'dash',
          accessor: data => getCoinPrice(data, 'DASH')
        }
      ]
    },
    {
      Header: 'Fee',
      columns: [{
        Header: '<>',
        accessor: 'fee'
      }]
    },
    {
      Header: 'Purchase Options',
      columns: [{
        Header: '<>',
        accessor: 'purchaseOptions'
      }]
    },
    {
      Header: 'Identity Verification',
      columns: [{
        Header: '<>',
        accessor: 'verify'
      }]
    },
    {
      Header: 'Coins Supported',
      columns: [{
        Header: '<>',
        accessor: 'coinsSupported'
      }]
    },
    {
      Header: 'Trading',
      columns: [{
        Header: '<>',
        accessor: 'trading'
      }]
    },
    {
      Header: 'Customer Service',
      columns: [{
        Header: '<>',
        accessor: 'service'
      }]
    },
    {
      Header: 'Social',
      columns: [
        {
          Header: 'Twitter',
          accessor: 'social'
        },
        {
          Header: 'Reddit',
          accessor: 'social'
        }
      ]
    },
    {
      Header: 'Interface',
      columns: [{
        Header: '<>',
        accessor: 'ux'
      }]
    }];
    // const exchangeRows = exchanges.map((row, i) => (
    //     <ExchangeRow onClick={(id) => this.handleUpdateExchange(row, i)} row={row} key={i}/>
    //   ));

    return (
      <ReactTable
        data={exchanges}
        columns={columns}
      />
    );
  }
}

class ExchangeHeader extends Component {
  //TODO make sortable
  render() {
    const headers = this.props.titles;
    const headerRows = headers.map(title => <th key={title}>{title}</th>);

    return(
      <tr>
        {headerRows}
      </tr>
    );
  }
}

class ExchangeRow extends Component {
  render() {
    const dataKeys = Object.keys(this.props.row) ? Object.keys(this.props.row) : [{}];
    // const row =
    // dataKeys.map((key, i) => {
    //   if(key === 'name'){
    //     <td key={i}>{this.props.row[col]}</td>
    //   } else if(key === 'coinData'){

    //   }
    // })

    return (
      <tr>
        {dataKeys.map((col, j) =>
          this.props.row[col][0] && col === 'coinData' ? <td key={j}>{this.props.row[col][0].name+':'+ this.props.row[col][0].price}</td> : <td key={j}>{this.props.row[col]}</td>
        )}
          <td><button onClick={() => this.props.onClick(this.props.row._id)}>Update</button></td>
      </tr>
    );
  }
}

export default App;












