import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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
import {GetOffers, GetOffersByUserId} from  '../../../actions/Offer.js';

ReactGA.initialize('UA-131219503-1');
ReactGA.pageview('/');

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0
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
     if( nextProps.query !== this.props.query ||
       nextProps.zipcode !== this.props.zipcode ||
       nextProps.onlyEvents !== this.props.onlyEvents
     ) {
       const query = nextProps.query;
       const zipcode = nextProps.zipcode;
       const onlyEvents = nextProps.onlyEvents;
        this.setState({
          query: query,
          zipcode: zipcode,
          onlyEvents: onlyEvents,
          loading: true,
          offer: []
        });

        this.search(query, zipcode, onlyEvents);
     }
   }

   componentWillMount() {
        const {query, zipcode, onlyEvents} = this.props;
        this.setState({loading: true});
        this.search(query, zipcode, onlyEvents);
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

    withoutTime(date) {
      var d = new Date(date);
      console.log(d);
      d.setHours(0, 0, 0, 0);
      console.log(d);
      return d;
    }

    search(query, zipcode, onlyEvents){
      if ( query !== undefined && query !== "" ) {
        ReactGA.pageview(window.location.pathname + window.location.search);
      }

      let activeOffers = [];
      GetOffers(query, zipcode, (offers)=>{
        let products = offers.filter(o=> o.offerType === "product");
        let singleDayEvents = offers.filter(o=> o.offerType === "activity"
                            && o.datetimeFrom.toDate() >= new Date()
                            && o.datetimeFrom.toDate().getDate() === o.datetimeTo.toDate().getDate()
                            )
                            .sort(function (a, b) {
                                  return a.datetimeFrom.toDate() < b.datetimeFrom.toDate() ? -1 : 1});

        let multipleDayEvents = offers.filter(o=> o.offerType === "activity"
                                && o.datetimeTo.toDate() >= new Date()
                                && o.datetimeFrom.toDate().setHours(0,0,0,0) < o.datetimeTo.toDate().setHours(0,0,0,0)
                                )
                                .sort(function (a, b) {
                                  return a.datetimeFrom.toDate() < b.datetimeFrom.toDate() ? -1 : 1});

        console.log("singleDayEvents", singleDayEvents);
        activeOffers = activeOffers.concat(singleDayEvents);
        activeOffers = activeOffers.concat(multipleDayEvents);
        if (onlyEvents !== 'true'){
          activeOffers = activeOffers.concat(products);
        }

        this.setState({
               offers: activeOffers,
               loading: false
            });
      });
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

  handleKeyPress(e) {
    const {user} = this.props;
    if (user !== undefined && user !== null){
      if (e.key === 'Enter' && e.shiftKey) {
        GetOffersByUserId(user.uid, { adminView: true} , (offers)=>{
          this.setState({
                 offers: offers,
                 loading: false
              });
        });
      }
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
      <div id="main" name="main" onKeyUp={this.handleKeyPress.bind(this)} tabIndex="0">
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
