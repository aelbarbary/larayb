import React, { Component } from 'react';
import Header from '../Header/index';
import OfferList from '../Offer/List';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MySnackBar from  '../Common/MySnackBar.js';

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
  }

});

class Home extends Component {
  state = {query : '',
          alertOpen: false,
          alertMessage: ''}


  search(query){
    this.setState({query: query});
  }

  componentWillMount(){
    const { classes } = this.props;
    if (this.props.location.state !== undefined){
      this.setState(
        {
          alertOpen: this.props.location.state.alertOpen,
          alertMessage: this.props.location.state.alertMessage,
        });
      this.props.history.replace({
          pathname: '/',
          state: { alertOpen: false,
                  alertMessage: ''
           }
        })
    } else {
      this.setState(
        {
          alertOpen: true,
          alertMessage: <div>
            <a href="mailto:abdelrahman.elbarbary@gmail.com" className={classes.emailLink}>Advertise with us for free</a>
          </div>,
        });
    }
  }
  render() {
    console.log(this.props);
    const { classes } = this.props;
    const {alertOpen, alertMessage} = this.state;

    return (
      <div className={classes.App}>
        <Header search={this.search.bind(this)}/>

        <OfferList className={classes.offers} query={this.state.query}/>



        <MySnackBar open={alertOpen} message={alertMessage} ></MySnackBar>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
