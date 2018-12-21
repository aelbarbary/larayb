import React, { Component } from 'react';
import './App.sass';
import Home from './components/Home/index';
import NewOffer from './components/NewOffer/index';
import MyAccount from './components/MyAccount/index';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/global.sass';
import ReactGA from 'react-ga';

class App extends Component {
  constructor(props){
    super(props)
    ReactGA.initialize('UA-131219503-1');
    ReactGA.pageview('/');
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/newoffer/:userId" component={NewOffer}></Route>
          <Route path="/myaccount/:userId" component={MyAccount}></Route>
          <Route path="/" component={Home}></Route>

        </Switch>
      </Router>
    );
  }
}

export default App;
