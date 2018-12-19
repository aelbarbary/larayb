import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';



const styles = theme => ({
  card: {
    maxWidth: 400,
    minWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class MyAccount extends Component {
  state = { expanded: false };

  render() {
    

    return (
      <h1>My Account</h1>
    );
  }
}

Event.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyAccount);
