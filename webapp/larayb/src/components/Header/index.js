import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'
import './styles.sass';
import firebase, { auth, provider  } from '../../lib/firebase.js';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);


class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.navigateToUserInfo = this.navigateToUserInfo.bind(this);
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

  getUserId(user){
    return user.providerData[0].providerId + user.providerData[0].uid
  }

  navigateToUserInfo(){
    console.log("navigating");
    this.props.history.push('/userinfo')
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
        console.log(user.providerData);
        this.setState({
          user
        });
      });
  }


  render() {
    return (
      <header className="header">
      <Grid container spacing={24}>
        <Grid item xs={3}>
            <img src={logo} width='75px' height='75px' alt='logo' ></img>
              <h1>
                <Link to="/" >
                  LARAYB
                </Link>
            </h1>
        </Grid>

        <Grid item xs={6}>
          <Paper className='empty'></Paper>
        </Grid>
        <Grid item xs={3}>
          <div>
            {this.state.user ?
              <div>
                <div className='user-profile'>
                  <Avatar alt="Remy Sharp" src={this.state.user.photoURL}  className='avatar' />

                  <button onClick={this.logout}>Log Out</button>
                </div>
              </div>
               :
               <button onClick={this.login}>Log In</button>
             }
           </div>
        </Grid>
      </Grid>
    </header>
    );
  }
}

export default Header;
