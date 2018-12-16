import React, { Component } from 'react';
import './App.sass';
import Home from './components/Home/index';
import UserInfo from './components/UserInfo/index';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/global.sass';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/userinfo" component={UserInfo}></Route>
          <Route path="/" component={Home}></Route>

        </Switch>
      </Router>
    );
  }
}

export default App;
