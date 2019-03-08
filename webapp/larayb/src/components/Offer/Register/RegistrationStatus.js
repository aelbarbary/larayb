import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import "react-table/react-table.css";
import Root from '../../Root.js';
import {GetOffer} from  '../../../actions/Offer.js';
import {RenderOfferWebsite, RenderOfferPhone, RenderOfferDateTime, RenderOfferEmail} from "../../../common/CommonRenderMethods.js"
import {FormatAddressHelper} from "../../../common/CommonFormatMethods.js";
import MySnackBar from  '../../Common/MySnackBar.js';
import Map from  './Map.js'
import OfferDetails from  './OfferDetails.js'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    marginTop: 20
  },
  toolbarMain: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
  },
  mainFeaturedPost: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 4,
  },
  mainFeaturedPostContent: {
    padding: `${theme.spacing.unit * 6}px`,
    [theme.breakpoints.up('md')]: {
      paddingRight: 0,
    },
  },
  mainGrid: {
    marginTop: theme.spacing.unit * 3,
  },
  card: {
    display: 'flex',
    height: 150
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  markdown: {
    padding: `${theme.spacing.unit * 3}px 0`,
  },
  sidebarAboutBox: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey[200],
  },
  sidebarSection: {
    marginTop: theme.spacing.unit * 3,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
  },
  responsive:{
    width: '100%',
    height: 'auto'
  },
  description: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
});


class RegistrationStatus extends Component {
  state = {
    zoom: 11,
    totalCost: 0,
    center: null,
    offer: {}
   };

  componentWillMount(){
    this.setState({loading: true});
    const {id} = this.props.match.params;
    GetOffer(id, (data) => {
      this.setState({ offer: data, loading: false});

    });
  }

  render(){
    console.log("render");

    const { classes } = this.props;
    const {offer} = this.state;
    const phone = RenderOfferPhone (offer);
    const email =RenderOfferEmail(offer);
    const website = RenderOfferWebsite(offer);
    const address = FormatAddressHelper(offer.address,  offer.city, offer.state, offer.zip);
    const addressLink = "http://maps.google.com/?q=" + address;
    const offerDateTime = RenderOfferDateTime(offer);

    return (
      <Root>
        <React.Fragment>
          <CssBaseline />
          <div className={classes.layout}>
            <main>
              <Paper className={classes.mainFeaturedPost}>
                <OfferDetails offer={offer} showDescription={false}/>
              </Paper>
              <Grid container spacing={40} className={classes.cardGrid}>
                  <Grid item key={offer.title} xs={12} md={6}>
                    <Card className={classes.card}>
                      <div className={classes.cardDetails}>
                        <CardContent>
                          <Typography variant="subtitle1" color="textSecondary">
                            {offerDateTime}
                          </Typography>
                          <Typography variant="subtitle1" color="textSecondary">
                            <a
                              href={addressLink}
                              className={classes.addressLink}
                              target='_blank'
                              rel="noopener noreferrer">
                              {address}
                            </a>
                          </Typography>
                          {phone}
                          {website}
                          {email}
                        </CardContent>
                      </div>

                    </Card>
                  </Grid>

                  <Grid item key={offer.address} xs={12} md={6}>
                    <Map address={address} height={'150px'}/>
                  </Grid>

              </Grid>
              {/* End sub featured posts */}
              <Grid container spacing={40} className={classes.mainGrid}>
                {/* Main content */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Register
                  </Typography>
                  <Divider />

                  <MySnackBar open={this.state.alertOpen} message={this.state.alertMessage} onClosed={() => this.onSnackBarClosed()}></MySnackBar>

                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper elevation={0} className={classes.sidebarAboutBox}>
                    <Typography variant="h6" gutterBottom className={classes.cost} secondary>
                      Total Cost:  ${this.state.totalCost}
                    </Typography>
                    {/*<Button variant="outlined" color="primary" onClick={this.handlePaymentDialogOpen}>
                      Open full-screen dialog
                    </Button>
                    <Checkout open={this.state.paymentDialogOpen}/>
                    */}
                  </Paper>
                </Grid>
                {/* End sidebar */}
              </Grid>
            </main>
          </div>
        </React.Fragment>
      </Root>
  );
  }
}

RegistrationStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistrationStatus);
