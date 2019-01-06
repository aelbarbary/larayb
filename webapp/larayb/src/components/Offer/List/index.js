import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import qwest from 'qwest';
import firebase from '../../../lib/firebase.js';
import OfferCard from './OfferCard.js';
// import Paper from '@material-ui/core/Paper';
import ReactGA from 'react-ga';
import loading from '../../../assets/images/loading.gif'

ReactGA.initialize('UA-131219503-1');
ReactGA.pageview('/');
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
        loading: true,
        offer: []
      });

      this.search(query);
   }

   componentWillMount() {
        const {query} = this.props;
        this.setState({loading: true});
        this.search(query);
    }

    search(query){
      var offers = [];

      if (query === undefined || query === ""){
          firestore.collection("offers")
          .where("datetimeTo", ">=", new Date())
          .where("approved", "==", true)
          .orderBy("datetimeTo")
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                offers.push({  id: doc.id, ...doc.data()});
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

        ReactGA.pageview(window.location.pathname + window.location.search);

        firestore.collection("offers")
        .where("datetimeTo", ">=", new Date())
        .where("approved", "==", true)
        .where("tags", "array-contains", query.toLowerCase().trim())
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              offers.push({ id: doc.id, ...doc.data()});
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
      data = <img src={loading} alt="loading" />
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
