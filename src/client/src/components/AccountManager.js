import React, { Component } from 'react';
import Client from '../Client';
import update from 'immutability-helper';
import AccountChart from './AccountChart.js';
import '../App.css';


class AccountManager extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      accounts: [{}],
      name: '',
      username: ''
    };

    this.serverRequest = () => {
      const _this = this;
      Client.getStuff(`api/accounts/`, function(result){
        // console.log('ACCOUNT RESULT: ', result)
        _this.setState({
          accounts: result,
          loading: false
        });
      })
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(){
    return function(e){
      this.setState({[e.target.name]: e.target.value});
    }.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    let newAccount = {
      name: this.state.name,
      username: this.state.username
    };
    Client.postStuff(`api/accounts/`, newAccount);
    this.serverRequest();
    this.setState({
      name: '',
      username: ''
    });
  }

  componentDidMount(){
    this.serverRequest();
  }

  handleUpdateAccount(index){
    const _this = this;
    // temp data for simulating form update
    const data = {
      _id: '59965a6a359f6e1a3314a645',
      name: 'Duey',
      username: 'dueydash',
      wallets: [{
        _id: '59965bdc1d544a1aa403d1c9',
        coin: 'BTC',
        address: '1234567'}]
    };
    Client.putStuff(`api/accounts/`+data._id, data, function(result){
      // use update to persist state immutability - update certain account with result
      const updatedAccount = update(data, {
        name: {$set: result.name},
        username: {$set: result.username},
        wallets: {$set: result.wallets},
      });
      // replace certain account with updated account data
      const newAccounts = update(_this.state.accounts, {$splice: [[index, 1, updatedAccount]]})
      // set state with updated accounts, leaving original state record (for history)
      _this.setState({
        accounts: newAccounts
      })
    });

  }

  render(){
    const { accounts, name, username } = this.state;
    const allAccountCharts = accounts.map((account, i) => {
      return (
        <AccountChart
          account={account}
          key={i}
          onClick={(i) => this.handleUpdateAccount(i)}/>
    )})

    return (
      <div>
        <h2>Accounts:</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} name="name" onChange={this.handleChange()}/>
          </label>
          <label>
            Username:
            <input type="text" value={username} name="username" onChange={this.handleChange()}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <ol>{allAccountCharts}</ol>
      </div>
    );
  }
}

export default AccountManager;