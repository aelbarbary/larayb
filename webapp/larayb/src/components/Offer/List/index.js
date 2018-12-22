import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
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
           events: [],
           hasMoreItems: true,
           nextHref: null
       };

      this.loadItems = this.loadItems.bind(this);
   }

  loadItems(page) {
        var self = this;

        var events = self.state.events;
        firestore.collection("offers")
        .where("datetime", ">", new Date())
        .where("approved", "==", "1")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                events.push(doc.data());
            });
        })
        .then(()=>{
          self.setState({
                 events: events,
                 hasMoreItems: false
              });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

    }

  render() {
    const { classes } = this.props;

    const loader = <div className="loader" key="loading">Loading ...</div>;

    var items = [];
    this.state.events.map((event, i) => {

        items.push(
            <Grid item zeroMinWidth key={event.title}>
                <OfferCard event={event}></OfferCard>
            </Grid>
        );
        return ""
    });

    return (

        <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems.bind(this)}
            hasMore={this.state.hasMoreItems}
            loader={loader}>

              <Grid container spacing={24} justify="center" className={classes.root}>
                {items}
              </Grid>

        </InfiniteScroll>

    );
  }
}

Offers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Offers);
