import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './components/Header.js';
import Main from './components/Main.js';

class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <Header/>
          <Main/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;












