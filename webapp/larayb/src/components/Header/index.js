import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'
import './styles.sass';
import { auth, provider } from '../../lib/firebase.js';
import Avatar from '@material-ui/core/Avatar';


const styles = {
  avatar: {
    margin: 10,
  }
};

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
  auth.onAuthStateChanged((user) => {
    if (user) {
      this.setState({ user });
    }
  });
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
            <div>
              <div className='user-profile'>
                <Avatar alt="Remy Sharp" src={this.state.user.photoURL}  className={styles.avatar} />
              </div>
              <button onClick={this.logout}>Log Out</button>
            </div>

             :
             <button onClick={this.login}>Log In</button>
           }
           </div>
      </header>
    );
  }
}

export default Header;
