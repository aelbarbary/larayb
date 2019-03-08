import React, { Component } from 'react';
import Home from './components/Home/index';
import OfferForm from './components/Offer/Form';
import OfferRegistrationStatus from './components/Offer/Register/RegistrationStatus';
import ProviderForm from './components/Provider/Form';
import ProviderDetails from './components/Provider/Details';
import OfferDetails from './components/Offer/Details';
import MyAccount from './components/MyAccount/MyAccount.js';
import Register from './components/Offer/Register/Register.js';
import Login from './components/Login/index';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/global.sass';
import ReactGA from 'react-ga';
import { SharedDataProvider } from './context/SharedData.context.js';

ReactGA.initialize('UA-131219503-1');
ReactGA.pageview('/');

class App extends Component {

  render() {

    return (
        <Router>
          <SharedDataProvider>
              <Switch>
                <Route path="/offer/:id/details" component={OfferDetails}></Route>
                <Route path="/offer/:id/regstatus" component={OfferRegistrationStatus}></Route>
                <Route path="/offer/:id" component={OfferForm}></Route>
                <Route path="/offer" component={OfferForm}></Route>
                <Route path="/provider/:id/details" component={ProviderDetails}></Route>
                <Route path="/provider/:id" component={ProviderForm}></Route>
                <Route path="/provider" component={ProviderForm}></Route>
                <Route path="/myaccount/" component={MyAccount}></Route>
                <Route path="/search" component={Home}></Route>
                <Route path="/register/:id" component={Register}></Route>
                <Route path="/login/" component={Login}></Route>
                <Route path="/" component={Home}></Route>
              </Switch>
            </SharedDataProvider>
        </Router>
    );
  }
}

export default App;
