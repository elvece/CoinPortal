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
  handleUpdateExchange = (row) => {
    console.log(row)
    const ogRow = row.original;
    // persist this for use in callback function
    const _this = this;
    // temp data for simulating form update
    const data = {
      name: 'Gemini',
      coinData: [
        {
          _id: '5993a24a615a9ddef5724f05',
          name: 'BTC',
          url: 'https://api.gemini.com/v1/pubticker/btcusd',
          price: 4200
        },
        {
          _id: '5993a24a615a9ddef5724f04',
          name: 'ETH',
          url: 'https://api.gemini.com/v1/pubticker/ethusd',
          price: 420
        }
      ],
      social: [{
        _id: '5993a24a615a9ddef5724f06',
        name: 'Twitter',
        url: 'https://twitter.com/GeminiDotCom'
      }],
      trading: {
        _id:'5993a24a615a9ddef5724f02',
        orderTypes: ['Market','Limit', 'IOC', 'MOC'],
        auction: true,
        margin: false
      },
      coinsSupported: ['BTC', 'ETH'],
      accountNeeded: false
    };
    Client.putStuff(`api/exchanges/`+ogRow._id, data, function(result){
      // use update to persist state immutability - update certain exchange coinData with result
      console.log('result: ', result)
      const updatedExchange = update(ogRow, {
        accountNeeded: {$set: result.accountNeeded},
        coinData: {$set: result.coinData},
        coinsSupported: {$set: result.coinsSupported},
        social: {$set: result.social},
        trading: {$set: result.trading}
      });
      // replace certain exchange with updated exchange data
      const newExchanges = update(_this.state.exchanges, {$splice: [[row.index, 1, updatedExchange]]})
      // set state with updated exchanges, leaving original state record
      _this.setState({
        exchanges: newExchanges
      })
    });
  }

  render(){
    const { exchanges } = this.state;

    console.log(exchanges)

    function displayArrayAsList(data){
      let output = '';
      if(data){
        data.forEach((item, i) => {
          if(i !== data.length - 1){
            output += item + ', ';
          } else {
            output += item;
          }
        })
      }
      return output;
    }

    function getCoinPrice(data, name){
      let output = '--';
      data.coinData.forEach((coin) => {
        if(coin.name === name){
          output = coin.price;
        }
      })
      return output;
    }

    function getSocialInfo(data, name){
      let output = '--';
      if(data.social){
        data.social.forEach((acct) => {
          if(acct.name === name){
            output = acct;
          }
        })
      }
      return output;
    }

    function setAccountNeeded(data){
      let output = '';
      if(data === true){
        output = 'yes';
      } else if (data === false){
        output = 'no';
      }
      return output;
    }

    const columns = [
    {
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
      Header: 'Account Needed',
      columns: [{
        Header: '<>',
        id: 'accountNeeded',
        accessor: data => setAccountNeeded(data.accountNeeded)
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
      Header: 'Identity Verification', // make popover for coinbase that says depends on amount wanting to purchase
      columns: [{
        Header: '<>',
        accessor: 'verify'
      }]
    },
    {
      Header: 'Coins Supported',
      columns: [{
        Header: '<>',
        id: 'coinsSupported',
          accessor: data => data.coinsSupported ? displayArrayAsList(data.coinsSupported) : ''
      }]
    },
    {
      Header: 'Trading',
      columns: [
        {
          Header: 'Order Types',
          id: 'orderTypes',
          accessor: data => data.trading ? displayArrayAsList(data.trading.orderTypes) : ''
        },
        {
          Header: 'Margin',
          id: 'margin',
          accessor: data => data.trading ? data.trading.margin.toString() : ''
        },
        {
          Header: 'Auction',
          id: 'auction',
          accessor: data => data.trading ? data.trading.auction.toString() : ''
        }
      ]
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
          id: 'twitter',
          accessor: data => getSocialInfo(data, 'Twitter'),
          Cell: row => (<a href={row.row.twitter ? row.row.twitter.url : '/'}>Tweet</a>)
        },
        {
          Header: 'Reddit',
          id: 'reddit',
          accessor: data => getSocialInfo(data, 'Reddit'),
          Cell: row => (<a href={row.row.reddit ? row.row.reddit.url : '/'}>Arrr</a>)
        }
      ]
    },
    {
      Header: 'Interface',
      columns: [{
        Header: '<>',
        accessor: 'ux'
      }],
    },
    {
      Header: 'Options',
      columns: [{
        Header: 'Edit',
        accessor: '_id',
        Cell: row => (<button onClick={() => this.handleUpdateExchange(row)}>Update</button>)
      }]
    }];

    return (
      <ReactTable
        data={exchanges}
        columns={columns}
        defaultPageSize={5}
      />
    );
  }
}

export default App;












