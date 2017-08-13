import React, { Component } from 'react';
import Client from "./Client";
import './App.css';

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
  }
  componentDidMount(){
    const _this = this;
    this.serverRequest = Client.getStuff(`api/exchanges/`, function(result){
        _this.setState({
          exchanges: result
        });
      })
  }
  render(){
    return (
      <table className="table">
        <thead>
          <ExchangeHeader titles={Object.keys(this.state.exchanges[0])}/>
        </thead>
        <tbody>
          {this.state.exchanges.map((row, i) =>
            <ExchangeRow row={row} key={i}/>
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
 render() {
    return (
      <tr>
        {Object.keys(this.props.row).map((col, j) =>
          <td key={j}>{this.props.row[col]}</td>
        )}
      </tr>
    );
  }
}

export default App;












