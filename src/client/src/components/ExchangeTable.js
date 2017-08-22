import React, { Component } from 'react';
import Client from '../Client';
import '../App.css';
import '../styles/react-table.css';
import update from 'immutability-helper';
import ReactTable from 'react-table';
import { MdSort } from 'react-icons/lib/md';


class ExchangeTable extends Component {
  constructor(props){
    super(props);
    this.state = ({ loading: true, active: null });
    this.handleUpdateExchange = this.handleUpdateExchange.bind(this);
  }
  componentDidMount(){
    const _this = this;
    //TODO: refactor this into own method
    this.serverRequest = Client.getStuff(`api/exchanges/`, function(result, reject){
      if(result){
        _this.setState({
          exchanges: result,
          loading: false
        });
      }
      if(reject) console.log('SERVER REJECTION: ', reject)
      })
  }
  handleUpdateExchange = (row) => {
    // console.log('UPDATE ROW: ', row)
    const ogRow = row.original;
    // persist this for use in callback function
    const _this = this;
    // temp data for simulating form update
    const data = {};
    Client.putStuff(`api/exchanges/`+ogRow._id, data, function(result){
      // use update to persist state immutability - update certain exchange coinData with result
      // console.log('result: ', result)
      const updatedExchange = update(ogRow, {
        accountNeeded: {$set: result.accountNeeded},
        coinData: {$set: result.coinData},
        coinsSupported: {$set: result.coinsSupported},
        depositFee: {$set: result.depositFee},
        purchaseOptions: {$set: result.purchaseOptions},
        service: {$set: result.service},
        social: {$set: result.social},
        support: {$set: result.support},
        trading: {$set: result.trading},
        verify: {$set: result.verify},
        website: {$set: result.website},
        withdrawalFee: {$set: result.withdrawalFee},
        ux: {$set: result.ux}
      });
      // replace certain exchange with updated exchange data
      const newExchanges = update(_this.state.exchanges, {$splice: [[row.index, 1, updatedExchange]]})
      // set state with updated exchanges, leaving original state record
      _this.setState({
        exchanges: newExchanges
      })
    });
  }
  setActiveCell = (row, position, column) => {
    this.props.calculate(row.row[position]);
    if(this.state.active === row.row[position]) {
      this.setState({active : null})
    } else {
      this.setState({active : row.row[position]})
    }
  }

  setActiveCellBackgroundColor = (position, color) => {
    if (this.state.active === position) {
      return '#892323'
    }
    return '';
  }

  setActiveCellTextColor = (position) => {
    if (this.state.active === position) {
      return '#F4F4F2'
    }
    return '';
  }

  render(){
    const { exchanges, loading } = this.state;

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

    function setFriendlyBoolean(data){
      let output = '';
      if(data === true){
        output = 'yes';
      } else if (data === false){
        output = 'no';
      }
      return output;
    }

    const columns =
    [
      {
        Header: 'Name',
        headerClassName: 'mdl-data-table__cell',
        columns: [{
          Header: <MdSort/>,
          accessor: 'name',
          Cell: row => (<a target="_blank" href={row.original.website ? row.original.website : '/'}>{row.row.name}</a>)
          // style: {transform: rotateX(180deg)};
        }]
      },
      {
        Header: 'Coin Prices',
        columns: [
          {
            Header: 'BTC',
            id: 'btc',
            accessor: data => getCoinPrice(data, 'BTC'),
            Cell: (row) => (
              <span name='price' style={{
                backgroundColor: this.setActiveCellBackgroundColor(row.row.btc), color: this.setActiveCellTextColor(row.row.btc), padding: '14px 11px 14px 11px'
              }}
              onClick={() => this.setActiveCell(row, 'btc')}>
              {row.row.btc}
              </span>
            )
          },
          {
            Header: 'ETH',
            id: 'eth',
            accessor: data => getCoinPrice(data, 'ETH'),
            Cell: (row) => (
              <span name='price' style={{
                backgroundColor: this.setActiveCellBackgroundColor(row.row.eth), color: this.setActiveCellTextColor(row.row.eth), padding: '14px 11px 14px 11px'
              }}
              onClick={() => this.setActiveCell(row, 'eth')}>
              {row.row.eth}
              </span>
            )
          },
          {
            Header: 'LTC',
            id: 'ltc',
            accessor: data => getCoinPrice(data, 'LTC'),
            Cell: (row) => (
              <span name='price' style={{
                backgroundColor: this.setActiveCellBackgroundColor(row.row.ltc), color: this.setActiveCellTextColor(row.row.ltc), padding: '14px 11px 14px 11px'
              }}
              onClick={() => this.setActiveCell(row, 'ltc')}>
              {row.row.ltc}
              </span>
            )
          },
          {
            Header: 'DASH',
            id: 'dash',
            accessor: data => getCoinPrice(data, 'DASH'),
            Cell: (row) => (
              <span name='price' style={{
                backgroundColor: this.setActiveCellBackgroundColor(row.row.dash), color: this.setActiveCellTextColor(row.row.dash), padding: '14px 11px 14px 11px'
              }}
              onClick={() => this.setActiveCell(row, 'dash')}>
              {row.row.dash}
              </span>
            )
          }
        ]
      },
      {
        Header: 'Fees',
        columns: [
          {
            Header: 'Withdrawl',
            accessor: 'withdrawalFee'
          }
          // {
          //   Header: 'Deposit',
          //   accessor: 'depositFee'
          // },
        ]
      },
      // {
      //   Header: 'Account Needed',
      //   columns: [{
      //     Header: <MdSort/>,
      //     id: 'accountNeeded',
      //     accessor: data => setFriendlyBoolean(data.accountNeeded),
      //     minWidth: 200
      //   }]
      // },
      {
        Header: 'Purchase Options',
        columns: [{
          Header: <MdSort/>,
          id: 'purchaseOptions',
          accessor: data => data.purchaseOptions ? displayArrayAsList(data.purchaseOptions) : '',
          minWidth: 220
        }]
      },
      {
        Header: 'Account/Verification', // make popover for coinbase that says depends on amount wanting to purchase
        columns: [{
          Header: <MdSort/>,
          id: 'verify',
          accessor: data => setFriendlyBoolean(data.verify),
          minWidth: 220
        }]
      },
      // {
      //   Header: 'Coins Supported',
      //   columns: [{
      //     Header: '<>',
      //     id: 'coinsSupported',
      //       accessor: data => data.coinsSupported ? displayArrayAsList(data.coinsSupported) : ''
      //   }]
      // },
      // {
      //   Header: 'Trading',
      //   columns: [
      //     {
      //       Header: 'Order Types',
      //       id: 'orderTypes',
      //       accessor: data => data.trading && data.trading.length > 0 ? displayArrayAsList(data.trading[0].orderTypes) : ''
      //     },
      //     {
      //       Header: 'Margin',
      //       id: 'margin',
      //       accessor: data => data.trading && data.trading.length > 0 ? data.trading[0].margin.toString() : ''
      //     },
      //     {
      //       Header: 'Auction',
      //       id: 'auction',
      //       accessor: data => data.trading && data.trading.length > 0 ? data.trading[0].auction.toString() : ''
      //     }
      //   ]
      // },
      // {
      //   Header: 'Social',
      //   columns: [
      //     {
      //       Header: 'Twitter',
      //       id: 'twitter',
      //       accessor: data => getSocialInfo(data, 'Twitter'),
      //       Cell: row => (<a href={row.row.twitter ? row.row.twitter.url : '/'}>Tweet</a>)
      //     },
      //     {
      //       Header: 'Reddit',
      //       id: 'reddit',
      //       accessor: data => getSocialInfo(data, 'Reddit'),
      //       Cell: row => (<a href={row.row.reddit ? row.row.reddit.url : '/'}>Arrr</a>)
      //     }
      //   ]
      // },
      // {
      //   Header: 'Ratings',
      //   columns: [
      //     {
      //       Header: 'Interface',
      //       accessor: 'ux',
      //     },
      //     {
      //       Header: 'Customer Service',
      //       accessor: 'service',
      //     },
      //     {
      //       Header: 'Support',
      //       accessor: 'support',
      //     }
      //   ],
      // },
      {
        Header: 'Options',
        columns: [{
          Header: 'Edit',
          accessor: '_id',
          Cell: row => (<button onClick={() => this.handleUpdateExchange(row)}>Update</button>)
        }],
      },
    ];

    return (
      <ReactTable
        data={exchanges}
        columns={columns}
        defaultPageSize={5}
        loading={loading}
        defaultSorted={[
          {
            id: 'btc',
            desc: false
          }
        ]}
        showPagination={false}
        showPageJump={false}
        sortable={true}
        PadRowComponent ={() => <span>&nbsp;</span>}
        className="-striped"
      />
    );
  }
}

export default ExchangeTable;