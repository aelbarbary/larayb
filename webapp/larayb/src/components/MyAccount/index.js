import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { withStyles } from '@material-ui/core/styles';
import ProviderList from '../Provider/List/AdminList.js';
import OfferList from '../Offer/List/AdminList.js';
import Settings from './Settings.js';
import Profile from './Profile.js';
import { auth, facebookProvider } from '../../lib/firebase.js';

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    height: 100
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
    flexGrow: 1,
    height: 260
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  active:{
    backgroundColor: 'lightgray'
  },
  inactive:{
    backgroundColor: 'white'
  }

});

class MyAccount extends React.Component {
  state = {
    mobileOpen: false,
    activeIndex: 1,
    user: {}
  };

  componentWillReceiveProps(props){
    const {user} = this.props.location.state;
    this.setState({user});
  }
  componentWillMount(){
    const {user} = this.props.location.state;

    if (user.providerId === "facebook.com"){
      auth.signInWithPopup(facebookProvider)
        .then((result) => {
          this.setState({
            user: {...user, accessToken: result.credential.accessToken }
          });
        });
    }
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleNavigation(activeIndex) {
    this.setState({activeIndex: activeIndex})
  }

  render() {
    const { classes, theme } = this.props;
    const {user} = this.state;
    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
            <ListItem button key="1" onClick={() => this.handleNavigation(1)}
              className={this.state.activeIndex === 1 ? classes.active : classes.inactive}>
              <ListItemIcon><EventAvailableIcon /></ListItemIcon>
              <ListItemText primary="Offers" />
            </ListItem>

            <ListItem button key="2" onClick={() => this.handleNavigation(2)}
              className={this.state.activeIndex === 2 ? classes.active : classes.inactive}>
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary="Providers" />
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

    if (user.userId !== undefined){
      return (
        <div className={classes.root}>

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
            { this.state.activeIndex === 1 && <OfferList user={user}/> }
            { this.state.activeIndex === 2 && <ProviderList user={user}/> }
            { this.state.activeIndex === 3 && <Settings user={user}/> }
            { this.state.activeIndex === 4 && <Profile user={user}/> }
          </main>
        </div>
      );
    } else {
      return "";
    }
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
