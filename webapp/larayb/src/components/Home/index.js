import React, { Component } from 'react';
import Header from '../Header/index';
import OfferList from '../Offer/List';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({

  App:{
    margin: 0
  }

});

class Home extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.App}>
        <Header/>
        <OfferList/>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
