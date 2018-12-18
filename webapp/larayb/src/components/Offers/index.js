import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
// import qwest from 'qwest';
import firebase from '../../lib/firebase.js';
import Event from '../Event/index';

const firestore = firebase.firestore();

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
  },
  event:{
    textAlign: 'center'
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
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
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

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
    this.state.events.map((track, i) => {

        items.push(
            <Grid item xs={4}>
              <Event event={track} className={classes.event}></Event>
            </Grid>
        );
        return ""
    });

    return (
      <div className={classes.root}>
        <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems.bind(this)}
            hasMore={this.state.hasMoreItems}
            loader={loader}>
            <Grid container spacing={24}>
              {items}
            </Grid>
        </InfiniteScroll>
      </div>
    );
  }
}

Offers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Offers);
