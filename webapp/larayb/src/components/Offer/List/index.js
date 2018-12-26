import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import qwest from 'qwest';
import firebase from '../../../lib/firebase.js';
import OfferCard from './OfferCard.js';
// import Paper from '@material-ui/core/Paper';

const firestore = firebase.firestore();

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
  }
});

class Offers extends Component {

  constructor(props) {
       super(props);

       this.state = {
           offers: [],
           hasMoreItems: true,
           nextHref: null
       };

      // this.loadItems = this.loadItems.bind(this);
   }

   componentWillReceiveProps(nextProps) {
     const query = nextProps.query;

      this.setState({
        query: query
      });
      this.setState({offers: []})

      this.search(query);
   }

  componentWillMount() {
        this.search();
    }

    search(query){


      var offers = [];

      if (query === undefined || query === ""){
          firestore.collection("offers")
          .where("datetimeTo", ">=", new Date())
          .where("approved", "==", 1)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  offers.push(doc.data());
              });
          })
          .then(()=>{
            this.setState({
                   offers: offers,
                   hasMoreItems: false
                });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
      } else {
          console.log(query);
          firestore.collection("offers")
          .where("datetimeTo", ">=", new Date())
          .where("approved", "==", 1)
          .where("tags", "array-contains", query.trim())
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  offers.push(doc.data());
              });
          })
          .then(()=>{
            this.setState({
                   offers: offers,
                   hasMoreItems: false
                });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });

      }

    }

  render() {
    const { classes } = this.props;

    var items = [];
    this.state.offers.map((offer, i) => {

        items.push(
            <Grid item zeroMinWidth key={offer.title}>
                <OfferCard offer={offer}></OfferCard>
            </Grid>
        );
        return ""
    });

    return (

      <Grid container spacing={24} justify="center" className={classes.root}>
        {items}
      </Grid>

    );
  }
}

Offers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Offers);
