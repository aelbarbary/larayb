import React, { Component } from 'react';
import logo from '../../assets/images/logo.png'
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { fade } from '@material-ui/core/styles/colorManipulator';
import './styles.css';
import Grid from '@material-ui/core/Grid';
import Notifications from './Notifications.js';
import queryString from 'query-string';
import { SharedDataConsumer, SharedDataContext } from '../../context/SharedData.context.js';

// const messaging = firebase.messaging();
// const publicVapidKey = process.env.REACT_APP_FIREBASE_PUBLIC_VAPID_KEY
// messaging.usePublicVapidKey(publicVapidKey);

const styles = theme => ({

  headerRoot:{
    margin: 0,
    display: 'flex',
  },
  appBar:{
    backgroundColor: '#292c2f',
    zIndex: theme.zIndex.drawer + 1,
  },
  logo:{
    width: 30,
    height: 30,
    margin: 5,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 0,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontSize: 20
  },
  description: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    fontWeight: 'normal',
    marginLeft:40,
    color: 'white',
    fontSize: 15
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
    color: 'white'
  },
  searchIcon: {
    width: theme.spacing.unit * 4,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'green'
  },
  inputRoot: {
    color: 'white',
    width: '100%',
    fontWeight: 'bold',
    fontColor: 'white',
    backgroundColor: 'white',
  },
  zipRoot: {
    color: 'gray',
    width: 100,
    fontWeight: 'bold',
    fontColor: 'gray',
    backgroundColor: 'white',
    marginRight: 20
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 4,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 300,
    },
    fontSize: 16,
    color: 'gray',
    fontColor: 'gray'
  },
  zipInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit ,
    transition: theme.transitions.create('width'),
    width: 100,
    fontSize: 16,
    color: 'gray',
    fontColor: 'gray'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  button: {
    margin: theme.spacing.unit,
    color: 'white'
  },
  loginButton:{
    width: 300,
    fontSize: 14,
    margin: 10
  },
  userMenu:{
    marginTop: 50,
  },


});


class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      desktopLoginAnchorEl: null,
      query: '',
    };
    this.googleLogin = this.googleLogin.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null});
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null, mobileOpen: false });
  };

  handleQueryChange = event => {
    const query =  event.target.value;
    this.setState({ query: query });
  };

  handleZipCodeChange = event => {
    const zipcode =  event.target.value;
    this.setState({ zipcode: zipcode });
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      let search = "";
      if (this.state.query !== undefined && this.state.query.trim() !== ''){
        search = search + `?query=${this.state.query}`
      }
      if (this.state.zipcode !== undefined && this.state.zipcode.trim() !== ''){
        search = search + `&zipcode=${this.state.zipcode}`
      }
      this.props.history.push({
          pathname: `/search`,
          search: search
        })
    }
  }

  handleDesktopLoginClick = event => {
    this.setState({ desktopLoginAnchorEl: event.currentTarget });
  };

  handleDesktopLoginClose = () => {
    this.setState({ desktopLoginAnchorEl: null });
  };

  componentWillMount(){
    if (window.location.pathname.includes("search")){
      var path = this.props.history.location.pathname;
      const values = queryString.parse(path.split('?')[1]);
      var query = values.query;
      var zipcode = values.zipcode;
      if (query !== ""){
        this.setState({query: query, zipcode: zipcode});
      }
    }

    // messaging.onMessage(payload => {
    //   console.log('Message received. ', payload);
    //   // ...
    // });
    //
    // navigator.serviceWorker.addEventListener('message', function (event) {
    //   console.log('event listener', event);
    // });
    //
    // messaging.requestPermission().then(function() {
    //   console.log('Notification permission granted.');
    //   messaging.getToken().then(function(currentToken) {
    //     if (currentToken) {
    //       console.log(currentToken);
    //       //sendTokenToServer(currentToken);
    //       // updateUIForPushEnabled(currentToken);
    //     } else {
    //       // Show permission request.
    //       console.log('No Instance ID token available. Request permission to generate one.');
    //       // Show permission UI.
    //       // updateUIForPushPermissionRequired();
    //       // setTokenSentToServer(false);
    //     }
    //   }).catch(function(err) {
    //     console.log('An error occurred while retrieving token. ', err);
    //     // showToken('Error retrieving Instance ID token. ', err);
    //     // setTokenSentToServer(false);
    //   });
    //
    // }).catch(function(err) {
    //   console.log('Unable to get permission to notify.', err);
    // });
    //
    // messaging.onTokenRefresh(function() {
    //   messaging.getToken().then(function(refreshedToken) {
    //     console.log('Token refreshed.');
    //     // Indicate that the new Instance ID token has not yet been sent to the
    //     // app server.
    //     // setTokenSentToServer(false);
    //     // Send Instance ID token to app server.
    //     // sendTokenToServer(refreshedToken);
    //     // ...
    //   }).catch(function(err) {
    //     console.log('Unable to retrieve refreshed token ', err);
    //     // showToken('Unable to retrieve refreshed token ', err);
    //   });
    // });
  }

  componentDidMount() {
    const sharedDataContext = this.context;
    sharedDataContext.relogin();
  }

  logout() {
    const sharedDataContext = this.context;
    sharedDataContext.logout();
    this.setState({
        anchorEl: null,
        mobileOpen: null,
        mobileMoreAnchorEl: null
      });
    this.props.history.push('/');
  }


  googleLogin() {
    const sharedDataContext = this.context;
    sharedDataContext.googleLogin();
    this.setState({
      anchorEl: null,
      mobileOpen: null,
      mobileMoreAnchorEl: null
    });
  }

  facebookLogin() {
    const sharedDataContext = this.context;
    sharedDataContext.facebookLogin();
    this.setState({
      anchorEl: null,
      mobileOpen: null,
      mobileMoreAnchorEl: null
    });
  }

  getUser(userObject){
    if (userObject !== null){
      return {
        userId: userObject.uid,
        image: userObject.photoURL,
        providerId: userObject.providerData[0].providerId,
        displayName: userObject.displayName
      }
    }
    return null;
  }


  render() {

    const { anchorEl, mobileMoreAnchorEl, desktopLoginAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const sharedDataContext = this.context;
    const user = this.getUser(sharedDataContext.user);

    const renderMenu = user !== null ? (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={this.handleMenuClose}
          className='userMenu'
          TransitionProps={{timeout: 0}}
          >
          <MenuItem component={Link}
            to={{
                pathname: `/myaccount/`,
                state: {
                        user: user
                      }
              }}
            onClick={this.handleMenuClose}>
              My Account
          </MenuItem>
          <MenuItem onClick={this.logout}>Logout</MenuItem>
        </Menu>
      ) : '';

      const renderMobileMenu = (
        <SharedDataConsumer>
          {({ googleLogin }) => (
          <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={this.handleMobileMenuClose}
            className='userMenuMobile'
            TransitionProps={{timeout: 0}} >

          {user !== null ?
            <div>
              <MenuItem component={Link}
                to={{
                    pathname: `/myaccount/`,
                    state: {
                            user: user
                          }
                  }}
                onClick={this.handleMenuClose}
                >
                  My Account
              </MenuItem>
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </div>
            :
            <div>
              <MenuItem style={{margin: 10}}>
                    <GoogleLoginButton onClick={this.googleLogin} style={{fontSize: 12, width: '100%', margin: 10}}/>
              </MenuItem>
              <MenuItem style={{margin: 10}} >
                <FacebookLoginButton onClick={this.facebookLogin} style={{fontSize: 12, width: '100%', margin: 10}}/>
              </MenuItem>
            </div>

          }
          </Menu>
          )}
        </SharedDataConsumer>

      );

    return (
      <SharedDataConsumer>
        {({ googleLogin, user }) => (
        <div className={classes.headerRoot}>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" component={Link} to="/">
                <img src={logo} width='30px' height='30px' alt='logo' className={classes.logo}></img>
              </IconButton>

              <Typography className={classes.title} variant="h6" color="inherit" noWrap component={Link} to="/">
                LARAYB
              </Typography>

              <Typography className={classes.description} color="inherit" noWrap>
                Islamic Events, Products and Services in WA State
              </Typography>

              <div className={classes.grow} />

              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  value={this.state.query}
                  onChange={this.handleQueryChange}
                  onKeyPress={this.handleKeyPress}
                />

              </div>
              <InputBase
                placeholder="Zip Code"
                value={this.state.zipcode}
                onChange={this.handleZipCodeChange}
                onKeyPress={this.handleKeyPress}
                classes={{
                  root: classes.zipRoot,
                  input: classes.zipInput,
                }}
              />

              <div className={classes.sectionDesktop}>

                { user ?
                  <Grid container>
                    <Grid>
                      <Notifications user={user}/>
                    </Grid>
                    <Grid>
                      <IconButton
                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleProfileMenuOpen}
                        color="inherit"
                      >
                        <div>
                          <div className='user-profile'>
                            <Avatar alt="" src={user.photoURL}  className='avatar' />
                          </div>
                        </div>
                      </IconButton>
                    </Grid>
                  </Grid>
                  :
                    <div>
                      <Button className={classes.button} onClick={this.handleDesktopLoginClick}>
                        Login
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={desktopLoginAnchorEl}
                        open={Boolean(desktopLoginAnchorEl)}
                        onClose={this.handleDesktopLoginClose}
                        className='userMenu'
                      >
                        <div>
                        <MenuItem onClick={this.handleDesktopLoginClose} style={{margin: 10}}>
                            <GoogleLoginButton onClick={this.googleLogin} style={{fontSize: 12, width: '100%', margin: 10}}/>
                        </MenuItem>
                        <MenuItem onClick={this.handleDesktopLoginClose} style={{margin: 10}}>
                            <FacebookLoginButton onClick={this.facebookLogin} style={{fontSize: 12, width: '100%', margin: 10}}/>
                        </MenuItem>
                        </div>
                      </Menu>
                    </div>
                }

              </div>
              <div className={classes.sectionMobile}>
                <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMenu}
          {renderMobileMenu}
        </div>
      )}
    </SharedDataConsumer>
    );
  }
}

Header.contextType = SharedDataContext;
Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Header));
