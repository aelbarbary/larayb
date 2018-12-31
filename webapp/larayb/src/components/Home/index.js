import React, { Component } from 'react';
import OfferList from '../Offer/List';
// import OfferDetails from '../Offer/Details';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MySnackBar from  '../Common/MySnackBar.js';
import GetProviders from  '../../actions/Provider.js';
import {withRouter} from 'react-router-dom';

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

let providers = [];
GetProviders()
.then( (querySnapshot) => {
  querySnapshot.forEach((doc) => {
    providers.push({id: doc.id, ...doc.data()});
  });
});

class Home extends Component {
  state = {query : '',
          alertOpen: false,
          alertMessage: '',
          providers: []}

  componentWillReceiveProps(nextProps){
    this.readSearchTerm(nextProps);
  }

  componentWillMount(){
  
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
    }

    this.readSearchTerm(this.props);
    // else {
    //   this.setState(
    //     {
    //       alertOpen: true,
    //       alertMessage: <div>
    //         <a href="mailto:abdelrahman.elbarbary@gmail.com" className={classes.emailLink}>Advertise with us for free</a>
    //       </div>,
    //     });
    // }



  }

  readSearchTerm(props){
    const {term} = props.match.params;
    this.setState({query: term});
  }
  render() {
    const { classes } = this.props;
    console.log(this.state.query);
    const {alertOpen, alertMessage} = this.state;

    return (
      <div className={classes.App}>

        <OfferList className={classes.offers} query={this.state.query} providers={providers}/>

        <MySnackBar open={alertOpen} message={alertMessage} ></MySnackBar>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Home));
