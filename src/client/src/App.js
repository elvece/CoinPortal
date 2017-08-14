import React, { Component } from 'react';
import Client from "./Client";
import './App.css';
import update from 'immutability-helper';

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
      exchanges: [{}]
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
  handleUpdateExchange = (id, index) => {
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
          price: 4000
        },
        {
          // _id: '599096e1b30477a081a26e8a', //lvcEx
          _id: '5990d89be937d9aa5f0f3fe2', //lvcEx2
          name: 'ETH',
          url: 'https://api.gemini.com/v1/pubticker/ethusd',
          price: 400
        }
      ]
    };
    Client.putStuff(`api/exchanges/`+id, data, function(result){
      // use update to persist state immutability - update certain exchange coinData with result
      const updatedExchange = update(_this.state.exchanges[index], {coinData: {$set: result.coinData}});
      // replace certain exchange with updated exchange data
      const newExchanges = update(_this.state.exchanges, {$splice: [[index, 1, updatedExchange]]})
      // set state with updated exchanges, leaving original state record
      _this.setState({
        exchanges: newExchanges
      })
    });
  }

  render(){
    return (
      <table className="table">
        <thead>
          <ExchangeHeader titles={this.state.exchanges[0] ? Object.keys(this.state.exchanges[0]) : []}/>
        </thead>
        <tbody>
          {this.state.exchanges.map((row, i) =>
            <ExchangeRow onClick={(id) => this.handleUpdateExchange(id, i)} row={row} key={i}/>
          )}
        </tbody>
      </table>
    );
  }
}

class ExchangeHeader extends Component {
  render() {
    return(
      <tr>
        {this.props.titles.map(title =>
          <th key={title}>{title}</th>
        )}
      </tr>
    );
  }
}

class ExchangeRow extends Component {
  //TODO make data proper before rendering; make dynamic to account for multiple coins
  render() {
    const row = Object.keys(this.props.row) ? Object.keys(this.props.row) : [{}];
    return (
      <tr>
        {row.map((col, j) =>
          this.props.row[col][0] && col === 'coinData' ? <td key={j}>{this.props.row[col][0].name+':'+ this.props.row[col][0].price}</td> : <td key={j}>{this.props.row[col]}</td>
        )}
          <td><button onClick={() => this.props.onClick(this.props.row._id)}>Update</button></td>
      </tr>
    );
  }
}

export default App;












