import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import firebase from '../../../lib/firebase.js';
import OfferCard from './OfferCard.js';
import ReactGA from 'react-ga';
import loading from '../../../assets/images/loading.gif'
import Reveal from 'react-reveal/Reveal';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import {SaveEmail}  from  '../../../actions/Email.js';

ReactGA.initialize('UA-131219503-1');
ReactGA.pageview('/');
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
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
           emailListOpen: false
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

    isBottom(el) {
      return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    componentDidMount() {
      document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
      document.removeEventListener('scroll', this.trackScrolling);
    }

    trackScrolling = () => {
      const wrappedElement = document.getElementById('main');
      if (this.isBottom(wrappedElement) && this.state.loading === false) {
        document.removeEventListener('scroll', this.trackScrolling);
        this.setState({emailListOpen: true});
      }
    };

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

    subscribe(){
      SaveEmail(this.state.email)
      this.setState({ emailListOpen: false });
    }

  handleEmailListClose = () => {
      this.setState({ emailListOpen: false });
    };

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };

    shouldComponentUpdate(nextProps, nextState) {
     if(this.state.email !== nextState.email) {
          return false
     }
     return true
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

                  <Grid item zeroMinWidth key={offer.id} >
                    <Reveal effect="fadeInUp" duration={i% 10 * 100}>
                      <OfferCard offer={offer}></OfferCard>
                    </Reveal>
                  </Grid>

            );
            return ""
        });
        data = items
    }
    return (
      <div id="main" name="main">
        <Grid container spacing={24} justify="center" className={classes.root}>
          {data}
        </Grid>

        <Dialog
          open={this.state.emailListOpen}
          onClose={this.handleEmailListClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Subscribe
          </DialogTitle>
          <DialogContent>

            <DialogContentText>
              To subscribe to LARAYB, please enter your email address here. We will send
              updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              onChange={this.handleChange('email').bind(this)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleEmailListClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.subscribe.bind(this)} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    );
  }
}

Offers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Offers);
