import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import qwest from 'qwest';
import firebase from '../../../lib/firebase.js';
import OfferCard from './OfferCard.js';
// import Paper from '@material-ui/core/Paper';

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

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
           nextHref: null,
           loading: false,
       };
   }

   componentWillReceiveProps(nextProps) {
     const query = nextProps.query;
      this.setState({
        query: query,
        loading: true
      });
      this.setState({offers: []})

      this.search(query);
   }

   componentWillMount() {
        const {query} = this.props;
        this.search(query);
    }

    search(query){
      console.log("query", query);
      var offers = [];
      const {providers} = this.props;

      if (query === undefined || query === ""){
          firestore.collection("offers")
          .where("datetimeTo", ">=", new Date())
          .where("approved", "==", true)
          .orderBy("datetimeTo")
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const offerData = doc.data();
                let provider = {};
                if (offerData.provider !== undefined){
                  provider = providers.filter( function(p){
                    return p.id === offerData.provider.id
                  })[0];
                }
                offers.push({ provider:provider, id: doc.id, ...doc.data()});
              })
          })
          .then(()=>{
            this.setState({
                  offers: offers,
                  loading: false
                });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
      } else {

        firestore.collection("offers")
        .where("datetimeTo", ">=", new Date())
        .where("approved", "==", true)
        .where("tags", "array-contains", query.toLowerCase().trim())
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const offerData = doc.data();
              let provider = {};
              if (offerData.provider !== undefined){
                provider = providers.filter( function(p){
                  return p.id === offerData.provider.id
                })[0];
              }
              offers.push({ provider:provider, id: doc.id, ...doc.data()});
            })
        })
        .then(()=>{
          this.setState({
                offers: offers,
                 loading: false
              });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

      }
    }

  render() {
    const { classes } = this.props;
    let data;

    if (this.state.loading) {
      data = <img  src="https://file.mockplus.com/image/2018/04/d938fa8c-09d3-4093-8145-7bb890cf8a76.gif" alt="loading" />
    } else {
        var items = [];
        this.state.offers.map((offer, i) => {

            items.push(
                <Grid item zeroMinWidth key={offer.title} >
                    <OfferCard offer={offer}></OfferCard>
                </Grid>
            );
            return ""
        });
        data = items
    }
    return (
      <div>

        <Grid container spacing={24} justify="center" className={classes.root}>
          {data}
        </Grid>

      </div>

    );
  }
}

Offers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Offers);
