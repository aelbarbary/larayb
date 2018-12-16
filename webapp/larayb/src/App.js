import React, { Component } from 'react';
import './App.sass';
import Home from './components/Home/index';
import NewOffer from './components/NewOffer/index';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/global.sass';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/newoffer/:userId" component={NewOffer}></Route>
          <Route path="/" component={Home}></Route>

        </Switch>
      </Router>
    );
  }
}

export default App;
