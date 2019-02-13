import React, { Component } from 'react';
import OfferList from '../Offer/List';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MySnackBar from  '../Common/MySnackBar.js';
import {withRouter} from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Root from '../Root.js';

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
  state = {query : '',
          alertOpen: false,
          alertMessage: '',
          category: ''
          }

  componentWillReceiveProps(nextProps){
    this.readSearchQuery(nextProps);
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
    this.readSearchQuery(this.props);

  }

  handleTabChange = (event, category) => {
    this.setState({category: category});
    this.props.history.push({
           pathname: `/search/${category}`,
         });
  };

  readSearchQuery(props){
    const {query} = props.match.params;
    this.setState({query: query});
  }
  render() {
    const { classes } = this.props;
    const {alertOpen, alertMessage} = this.state;

    return (
      <Root>
        <Tabs
          value={this.state.category}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab style={{display: 'none'}} value="" label=""/>
          <Tab value="youth" label="Youth"/>
          <Tab value="women" label="Sisters"/>
          <Tab value="food" label="Food"/>
          <Tab value="services" label="Services"/>

        </Tabs>

        <OfferList className={classes.offers} query={this.state.query}/>

        <MySnackBar open={alertOpen} message={alertMessage} ></MySnackBar>
      </Root>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Home));
