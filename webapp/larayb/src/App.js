import React, { Component } from 'react';
import './App.css';
import Header from './components/Header/index';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './styles/global.sass';


class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header/>
        </div>
      </Router>
    );
  }
}

export default App;
