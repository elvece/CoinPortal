import React, { Component } from 'react';
import '../App.css';

class Footer extends Component {

  render() {
    return (
      <footer>
        <div style={{textAlign: 'center'}}>
          <a href="https://github.com/elvece/coin-portal" target="_blank" rel="noopener noreferrer"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwjaQPPek4x-S_r1rdmprzPzGMbmdQ7tX1yBvjbXrKjYQ5bpSA98i9u8c" alt="GitHub" height="50"/></a>
        </div>
      </footer>
    );
  }
}

export default Footer;