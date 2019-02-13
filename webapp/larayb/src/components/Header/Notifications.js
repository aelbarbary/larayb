import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import {GetNotifications, MarkNotificationsAsRead} from  '../../actions/Notification.js';

const styles = theme => ({
  margin: {
    marginTop: 25,
    marginRight: 10,
  },
  notification:{
    fontSize: 12
  }

});

class Notifications extends Component {
  state = {
            notificationAnchorEl: null,
            notifications: [],
          }

  constructor(props){
    super(props);
    this.updateNotifications = this.updateNotifications.bind(this);
  }

  componentWillReceiveProps(nextProps){

  }

  componentWillMount(){
    const {user} = this.props;
    GetNotifications(user.uid, (notifications) =>{
      this.setState({ notifications: notifications });
      this.timer = setInterval(this.updateNotifications, 1000);
    });
  }

  updateNotifications(){
    const {user} = this.props;
    if (user !== undefined){
      GetNotifications(user.uid, (notifications) =>{
        this.setState({ notifications: notifications });
      });
    }
  }

  handleNotificationClick = event => {
    const {user} = this.props;
    if (this.state.notifications.length > 0){
        this.setState({ notificationAnchorEl: event.currentTarget });
        MarkNotificationsAsRead(user.uid);
    }
  };

  handleNotificationClose = event => {
    this.setState({ notificationAnchorEl: null });
  };

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  render() {
    const { classes } = this.props;
    const {notificationAnchorEl } = this.state;

    let notificationsList = [];
    this.state.notifications.map((notification, i) => {
        notificationsList.push(
          <MenuItem style={{margin: 10}} key={i}>
            <Typography className={classes.notification} variant="h6" color="inherit" noWrap component={Link} to="/">
              {notification.message}
            </Typography>
          </MenuItem>
        );
        return '';
    });

    return (
      <div className={classes.App}>
        <Badge
          color="secondary"
          badgeContent={this.state.notifications.filter(n=> n.read === false).length}
          invisible={this.state.notifications.filter(n=> n.read === false).length === 0}
          className={classes.margin}
          onClick={this.handleNotificationClick}
        >
          <MailIcon />
        </Badge>
        <Menu
          id="notification-menu"
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={this.handleNotificationClose}
          className='notificationMenu'
          TransitionProps={{timeout: 0}}
        >
          <div>
            {
                notificationsList
            }
          </div>
        </Menu>
      </div>
    );
  }
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Notifications));
