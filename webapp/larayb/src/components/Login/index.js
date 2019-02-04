import React, { Component } from 'react';

import { auth, googleProvider, facebookProvider } from '../../lib/firebase.js';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";

const styles = theme => ({

});

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.googleLogin = this.googleLogin.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);

  }


  googleLogin() {
    const {callbackLink} = this.props.location.state;
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        this.props.history.push({
               pathname: callbackLink,
             });
      });
  }

  facebookLogin() {
    const {callbackLink} = this.props.location.state;
    auth.signInWithPopup(facebookProvider)
      .then((result) => {
        this.props.history.push({
               pathname: callbackLink,
             });
      });
  }

  render() {
    return (
      <div >
        <div>
            <GoogleLoginButton onClick={this.googleLogin} style={{fontSize: 12, width: '100%', margin: 10}}/>
            <FacebookLoginButton onClick={this.facebookLogin} style={{fontSize: 12, width: '100%', margin: 10}}/>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Login));
