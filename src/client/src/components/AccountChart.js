import React, { Component } from 'react';
import Client from '../Client';
import update from 'immutability-helper';
import '../App.css';

class AccountChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      username: '',
      wallets: []
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(key){
    return function(e){
      let state = {};
      state[key] = e.target.value;
      console.log(state)
      this.setState(state);
    }.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    this.setState({
      name: '',
      username: '',
      wallets: []
    });
    Client.postStuff(`api/accounts/`, this.state);
  }

  handleUpdateAccount(){
    const _this = this;
    // temp data for simulating form update
    const data = {
      _id: '',
      name: 'test',
      username: 'testUserName',
      wallets: ['1234']
    };
    Client.putStuff(`api/accounts/`+data._id, data, function(result){
      // use update to persist state immutability - update certain account with result
      console.log('result: ', result)
      const updatedAccount = update(data, {
        name: {$set: result.name},
        username: {$set: result.username},
        wallets: {$set: result.wallets},
      });
      // replace certain exchange with updated exchange data
      const newAccount = update(_this.state.exchanges, {$splice: [[1, 1, updatedAccount]]})
      // set state with updated accounts, leaving original state record
      _this.setState({
        name: newAccount.name,
        username: newAccount.username,
        wallets: newAccount.wallets,
      })
    });

  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.name} onChange={this.handleChange('name')}/>
          </label>
          <label>
            Username:
            <input type="text" value={this.state.username} onChange={this.handleChange('username')}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <button onClick={() => this.handleUpdateAccount()}>Update</button>
      </div>
    );
  }
}

export default AccountChart;