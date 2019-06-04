import React, { Component } from 'react';
import Client from '../Client';
import update from 'immutability-helper';
import AccountChart from './AccountChart.js';
import '../App.css';
import CircularProgress from 'material-ui/CircularProgress';

class AccountManager extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      accounts: [],
      name: '',
      username: ''
    };

    this.serverRequest = async () => {
      const result = await Client.getStuff(`api/accounts/`)
      this.setState({
        accounts: result,
        loading: false
      });
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.serverRequest();
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


  async handleUpdateAccount(index){
    // temp data for simulating form update
    const data = {};
    const result = await Client.putStuff(`api/accounts/`+data._id, data)
    // use update to persist state immutability - update certain account with result
    const updatedAccount = update(data, {
      name: {
        $set: result.name
      },
      username: {
        $set: result.username
      },
      wallets: {
        $set: result.wallets
      },
    });
    // replace certain account with updated account data
    const accounts = update(this.state.accounts, {
      $splice: [
        [index, 1, updatedAccount]
      ]
    })
    // set state with updated accounts, leaving original state record (for history)
    this.setState({
      accounts,
    })

  }

  render(){
    const { accounts, loading } = this.state;
    const { prices } = this.props;
    let allAccountCharts;

    if(!loading && prices && prices.length >= 4){
      allAccountCharts = accounts.map((account, i) => {
        return (
          <AccountChart
            account={account}
            prices={prices}
            key={account.id}
            onClick={(i) => this.handleUpdateAccount(i)}/>
      )})
    } else {
      allAccountCharts = <CircularProgress size={80} thickness={5}/>
    }

    return (
      <div>
        <div className="mdl-grid Center-grid-content">
          {allAccountCharts}
        </div>
      </div>
    );
  }
}

export default AccountManager;