import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Header from './components/Header.js';
import Main from './components/Main.js';
import Footer from './components/Footer.js';

const muiTheme = getMuiTheme({
  palette: {
    //primary1Color: '#224D7F',//dark cerulean
    primary1Color: '#892323',//vivid auburn for now
    primary2Color: '#1C6D65',//deep green cyan turquoise
    primary3Color: '#222',//faded black
    accent1Color: '#E2B761',//earth yellow
    accent2Color: '#892323',//vivid auburn
    accent3Color: '#A3A19C',//quick silver
    alternateTextColor: '#F4F4F2',
    fontFamily: 'Roboto Condensed, sans-serif'
  }
});

class App extends Component {

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <Header/>
          <Main/>
          <Footer/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;












