import React, { Component } from 'react';
import Header from './Header/index';
import Footer from  './Footer/index.js';

class Root extends Component {

  render() {
    return (
      <div >
        <Header />
          {this.props.children}
        <Footer />
      </div>
    );
  }
}


export default Root;
