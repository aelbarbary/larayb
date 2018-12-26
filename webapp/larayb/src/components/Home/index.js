import React, { Component } from 'react';
import Header from '../Header/index';
import OfferList from '../Offer/List';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({

  App:{
    margin: 0
  },
  footer:{
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'gray',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  emailLink:{
    color: 'white',
    fontSize: 15
  },
  offers:{

  }

});

class Home extends Component {
  state = {query : ''}
  search(query){
    this.setState({query: query});
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.App}>
        <Header search={this.search.bind(this)}/>

        <OfferList className={classes.offers} query={this.state.query}/>

        <footer className={classes.footer}>
          <div>
            <a href="mailto:abdelrahman.elbarbary@gmail.com" className={classes.emailLink}>Advertise with us for free</a>
          </div>
        </footer>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
