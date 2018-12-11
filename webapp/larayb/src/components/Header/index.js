import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'
import './styles.sass';
import firebase, { auth, provider } from '../../lib/firebase.js';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
  }
  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }


  render() {
    return (
      <header className="header">
        <div>
          <img src={logo} width='75px' height='75px' alt='logo' ></img>
          </div>
          <h1>
            <Link  to="/" >
              LARAYB
            </Link>
          </h1>
          <div>
          {this.state.user ?
             <button onClick={this.logout}>Log Out</button>
             :
             <button onClick={this.login}>Log In</button>
           }
           </div>
      </header>
    );
  }
}

export default Header;
