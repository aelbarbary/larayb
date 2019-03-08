import React, { Component } from 'react';
import { auth, googleProvider, facebookProvider } from '../lib/firebase.js';

export const SharedDataContext = React.createContext();

export class SharedDataProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  googleLogin = () => {
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  facebookLogin = () =>{
    auth.signInWithPopup(facebookProvider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  logout = () => {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });

    });
  }

  relogin = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  render() {
    const { children } = this.props;

    return (
      <SharedDataContext.Provider
        value={{
          user: this.state.user,
          googleLogin: this.googleLogin,
          facebookLogin: this.facebookLogin,
          relogin: this.relogin,
          logout: this.logout
        }}>
        {children}
      </SharedDataContext.Provider>
    );
  }
}

export const SharedDataConsumer = SharedDataContext.Consumer;
