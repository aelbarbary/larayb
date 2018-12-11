import React, { Component } from 'react';
import './App.css';
import Header from './components/Header/index';
import Login from './components/Login/index';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './styles/global.sass';


class App extends Component {
  constructor() {
    super();
    // this.state = {
    //   currentItem: '',
    //   username: '',
    //   items: [],
    //   user: null // <-- add this line
    // }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header/>
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    );
  }
}

export default App;
