import React, { Component } from 'react';
import Client from '../Client';
import '../App.css';
import '../styles/react-table.css';
import update from 'immutability-helper';
import ReactTable from 'react-table';
import { MdSort } from 'react-icons/lib/md';
import Chip from 'material-ui/Chip';


class ExchangeTable extends Component {
  constructor(props){
    super(props);
    this.state = ({ loading: true, active: null, coins: [] });
    this.handleUpdateExchange = this.handleUpdateExchange.bind(this);
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
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
    const SHAPESHIFT = 'ShapeShift';
    const POLONIEX = 'Poloniex';
    let properPrice = row.row[position];
    if(row.row[position] !== '--'){
      if(row.row.name === SHAPESHIFT || row.row.name === POLONIEX){
        properPrice = this.convertPrices(row.row[position])
      }
      this.props.calculate(properPrice, position, row.row._original);
      if(this.state.active === row.row[position]) {
        this.setState({active: null})
        this.props.calculate(undefined, undefined, undefined);
      } else {
        this.setState({active: row.row[position]})
      }
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

  convertPrices = (price) => {
    if(this.props.btcData && this.props.btcData[0]){
      return (parseFloat(this.props.btcData[0].price_usd) * parseFloat(price)).round(2);
    } return '';
  }


  render(){
    const { exchanges, loading } = this.state;
    const SHAPESHIFT = 'ShapeShift';
    const POLONIEX = 'Poloniex';

    Number.prototype.round = function(p) {
      p = p || 10;
      return parseFloat( this.toFixed(p) );
    };

    function savePurchaseOption(data) {
      // console.log(data)
    }

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
    //TODO change to x or check, or disabled checkbox
    function setFriendlyBoolean(data){
      let output = '';
      if(data === true){
        output = 'yes';
      } else if (data === false){
        output = 'no';
      }
      return output;
    }

    //disable chip onClick if the price selected is not in the same row as the chip
    function displayChips(data){
      return data.map((item) => {
        return (
          <Chip key={item} style={{display: 'inline-block', margin: '2px'}} onClick={() => savePurchaseOption(item)}>{item}</Chip>
      )})
    }

    //TODO: show/hide columns
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
                backgroundColor: this.setActiveCellBackgroundColor(row.row.btc), color: this.setActiveCellTextColor(row.row.btc), padding: '7px 15px 7px 15px',
                  'borderRadius': '30px'
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
                backgroundColor: this.setActiveCellBackgroundColor(row.row.eth), color: this.setActiveCellTextColor(row.row.eth), padding: '7px 15px 7px 15px',
                  'borderRadius': '30px'
              }}
              onClick={() => this.setActiveCell(row, 'eth')}>
              {row.row.name === SHAPESHIFT || row.row.name === POLONIEX ? this.convertPrices(row.row.eth) : row.row.eth}
              </span>
            )
          },
          {
            Header: 'LTC',
            id: 'ltc',
            accessor: data => getCoinPrice(data, 'LTC'),
            Cell: (row) => (
              <span name='price' style={{
                backgroundColor: this.setActiveCellBackgroundColor(row.row.ltc), color: this.setActiveCellTextColor(row.row.ltc), padding: '7px 15px 7px 15px',
                  'borderRadius': '30px'
              }}
              onClick={() => this.setActiveCell(row, 'ltc')}>
              {row.row.name === SHAPESHIFT || row.row.name === POLONIEX ? this.convertPrices(row.row.ltc) : row.row.ltc}
              </span>
            )
          },
          {
            Header: 'DASH',
            id: 'dash',
            accessor: data => getCoinPrice(data, 'DASH'),
            Cell: (row) => (
              <span name='price' style={{
                backgroundColor: this.setActiveCellBackgroundColor(row.row.dash), color: this.setActiveCellTextColor(row.row.dash), padding: '7px 15px 7px 15px',
                  'borderRadius': '30px'
              }}
              onClick={() => this.setActiveCell(row, 'dash')}>
               {row.row.name === SHAPESHIFT || row.row.name === POLONIEX ? this.convertPrices(row.row.dash) : row.row.dash}
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
          },
          {
            Header: 'Deposit',
            accessor: 'depositFee',
            show: false
          },
        ]
      },
      {
        Header: 'Account Needed',
        columns: [{
          Header: <MdSort/>,
          id: 'accountNeeded',
          accessor: data => setFriendlyBoolean(data.accountNeeded),
          minWidth: 200,
          show: false
        }]
      },
      {
        Header: 'Purchase Options',
        columns: [{
          Header: <MdSort/>,
          id: 'purchaseOptions',
          accessor: data => data.purchaseOptions ? data.purchaseOptions : [],
          Cell: row => (displayChips(row.row.purchaseOptions)
            ),
          minWidth: 220
        }]
      },
      {
        Header: 'Verified Account', // make popover for coinbase that says depends on amount wanting to purchase
        columns: [{
          Header: <MdSort/>,
          id: 'verify',
          accessor: data => setFriendlyBoolean(data.verify),
          minWidth: 220
        }]
      },
      {
        Header: 'Coins Supported',
        columns: [{
          Header: '<>',
          id: 'coinsSupported',
            accessor: data => data.coinsSupported ? displayArrayAsList(data.coinsSupported) : '',
          show: false
        }]
      },
      {
        Header: 'Trading',
        columns: [
          {
            Header: 'Order Types',
            id: 'orderTypes',
            accessor: data => data.trading && data.trading.length > 0 ? displayArrayAsList(data.trading[0].orderTypes) : '',
          show: false
          },
          {
            Header: 'Margin',
            id: 'margin',
            accessor: data => data.trading && data.trading.length > 0 ? data.trading[0].margin.toString() : '',
          show: false
          },
          {
            Header: 'Auction',
            id: 'auction',
            accessor: data => data.trading && data.trading.length > 0 ? data.trading[0].auction.toString() : '',
          show: false
          }
        ]
      },
      {
        Header: 'Social',
        columns: [
          {
            Header: 'Twitter',
            id: 'twitter',
            accessor: data => getSocialInfo(data, 'Twitter'),
            Cell: row => (<a href={row.row.twitter ? row.row.twitter.url : '/'}>Tweet</a>),
          show: false
          },
          {
            Header: 'Reddit',
            id: 'reddit',
            accessor: data => getSocialInfo(data, 'Reddit'),
            Cell: row => (<a href={row.row.reddit ? row.row.reddit.url : '/'}>Arrr</a>),
          show: false
          }
        ]
      },
      {
        Header: 'Ratings',
        columns: [
          {
            Header: 'Interface',
            accessor: 'ux',
            show: false
          },
          {
            Header: 'Customer Service',
            accessor: 'service',
            show: false
          },
          {
            Header: 'Support',
            accessor: 'support',
            show: false
          }
        ],
      },
      {
        Header: 'Options',
        columns: [{
          Header: 'Edit',
          accessor: '_id',
          Cell: row => (<button className="mdl-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored"onClick={() => this.handleUpdateExchange(row)}>Update</button>),
          show: false
        },{
          Header: 'Purchase',
          accessor: '_id',
          Cell: row => (<button className="mdl-button mdl-button--accent mdl-button mdl-js-button mdl-button--raised mdl-button--colored"onClick={() => alert('Coming Soon!')}>BUY</button>)
        }]
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
        PadRowComponent={() => <span>&nbsp;</span>}
        className="-striped"
      />
    );
  }
}

export default ExchangeTable;