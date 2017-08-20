import React, { Component } from 'react';
import '../App.css';
import { MdAllOut } from 'react-icons/lib/md';
import { Link } from 'react-router-dom';


class Header extends Component {


  render() {
    return (
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <MdAllOut className="App-header-icon color-accent-1"/>
            <span className="mdl-layout-title">CoinPortal</span>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation mdl-layout--large-screen-only">
            <ul>
              <li><Link to='/dashboard'>Dashboard</Link></li>
              <li><Link to='/table'>Table</Link></li>
            </ul>
            </nav>
          </div>
        </header>
    );
  }
}

export default Header;

        // <div className="mdl-layout__drawer">
        //   <span className="mdl-layout-title">Account</span>
        //   <nav className="mdl-navigation">
        //     <a className="mdl-navigation__link" href="">Settings</a>
        //     <a className="mdl-navigation__link" href="">Charts</a>
        //   </nav>
        // </div>