import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import ProviderList from '../Provider/List/ProviderDataTable.js';
import OfferList from '../Offer/List/OfferDataTable.js';
import Settings from './Settings.js';
import Profile from './Profile.js';
import { auth, facebookProvider } from '../../lib/firebase.js';
import logo from '../../assets/images/logo.png'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    textAlign: 'center',
    paddingTop: 10
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    marginTop: 60
  },


});

class MyAccount extends React.Component {
  state = {
    mobileOpen: false,
    activeIndex: 1,
    user: {}
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleNavigation(activeIndex) {
    this.setState({activeIndex: activeIndex})
  }

  componentWillMount(){
    const {user} = this.props.location.state;
    this.setState({user});
    if (user.providerId === "facebook.com"){
      auth.signInWithPopup(facebookProvider)
        .then((result) => {
          this.setState({
            user: {...user, accessToken: result.credential.accessToken }
          });
        });
    }
  }

  render() {
    const { classes, theme } = this.props;
    const {user} = this.state;
    console.log(user);
    const drawer = (
      <div>
        <div className={classes.toolbar} >
          <a href="/">
            <img src={logo} width='50px' height='50px' alt='logo' ></img>
          </a>
        </div>
        <Divider />
        <List>

            <ListItem button key="1" onClick={() => this.handleNavigation(1)}
              className={this.state.activeIndex === 1 ? classes.active : classes.inactive}>
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary="Providers" />
            </ListItem>

            <ListItem button key="2" onClick={() => this.handleNavigation(2)}
              className={this.state.activeIndex === 2 ? classes.active : classes.inactive}>
              <ListItemIcon><EventAvailableIcon /></ListItemIcon>
              <ListItemText primary="Offers" />
            </ListItem>

            <ListItem button key="3" onClick={() => this.handleNavigation(3)}
              className={this.state.activeIndex === 3 ? classes.active : classes.inactive}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>

            <ListItem button key="4" onClick={() => this.handleNavigation(4)}
              className={this.state.activeIndex === 4 ? classes.active : classes.inactive}>
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              My Account ... Welcome {this.state.user.displayName}
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          { this.state.activeIndex === 1 && <ProviderList user={user}/> }
          { this.state.activeIndex === 2 && <OfferList user={user} /> }
          { this.state.activeIndex === 3 && <Settings user={user}/> }
          { this.state.activeIndex === 4 && <Profile user={user}/> }
        </main>
      </div>
    );
  }
}

MyAccount.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MyAccount);
