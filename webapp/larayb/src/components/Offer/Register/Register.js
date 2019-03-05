import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Root from '../../Root.js';
import { auth } from '../../../lib/firebase.js';
import {GetOffer} from  '../../../actions/Offer.js';
import {GetRegistrants, SaveRegistrants} from  '../../../actions/Registrant.js';
import {RenderOfferWebsite, RenderOfferPhone, RenderOfferDateTime, RenderOfferEmail} from "../../../common/CommonRenderMethods.js"
import {FormatAddressHelper} from "../../../common/CommonFormatMethods.js";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';
import MySnackBar from  '../../Common/MySnackBar.js';

// import Checkout from  './Payment.js'
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

class Register extends Component {
  state = {offer: {},
    loading: false,
    registrants:[],
    alertOpen: false,
    alertMessage: '',
    center: null,
    zoom: 11,
    totalCost: 0
   };

  componentWillMount(){
    this.setState({loading: true});
    const {id} = this.props.match.params;
    GetOffer(id, (data) => {
      this.setState({ offer: data, loading: false});

    });
  }

  componentDidMount() {
    const offerId =  this.props.match.params.id;
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        GetRegistrants(user.uid, offerId, (registrants)=>{
          this.setState({ registrants });
        })
      } else {
        this.props.history.push({
               pathname: `/login/`,
               state: {
                 callbackLink: `/register/${offerId}`
               }
             })
      }
    });
  }

  calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  handleRegister = cost => evt => {
   var item = {
     id: evt.target.id,
     name: evt.target.name,
     value: evt.target.value
   };
   var totalCost = 0;
   var registrants = this.state.registrants.slice();
   var newRegistrants = registrants.map(function(registrant) {
       if (registrant.id === item.value ) {
         registrant['registered'] = !registrant['registered'];
       }
       if (registrant['registered'] === true){
         totalCost += parseInt(cost);
       }
       return registrant;
   });
   this.setState({registrants:newRegistrants, totalCost: totalCost});
  };

  isRegistered(value){
    var registrants = this.state.registrants.slice();
    var i;
    for (i = 0; i <  registrants.length; i++){
      if (registrants[i].id === value ) {
        return registrants[i].registered;
      }
    }
    return false;
  }

  onSnackBarClosed(){
    this.setState({alertOpen: false, alertMessage:'' });
  }

  saveData(){
    const offerId = this.props.match.params.id;
    const {registrants, user} = this.state;
    const offerOwnerUserId = this.state.offer.userId;
    SaveRegistrants(registrants, user.uid, offerId, offerOwnerUserId);
    this.setState({alertOpen: true, alertMessage:'Saved.' });
  }

  handlePaymentDialogOpen = () => {
   this.setState({ paymentDialogOpen: true });
 };

 handlePaymentDialogClose = () => {
   this.setState({ paymentDialogOpen: false });
 };

  render(){
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
                <OfferDetails offer={offer}/>
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

                  <ReactTable
                    data={this.state.registrants}
                    showPagination={false}
                    columns={[
                      {
                        Header: "Name",
                        columns: [
                          {
                            Header: "",
                            accessor: "name",
                            className: 'center',
                            filterMethod: (filter, row) =>
                              row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                          }
                        ]
                      },
                      {
                        Header: "Gender",
                        columns: [
                          {
                            Header: "",
                            accessor: "gender",
                            filterMethod: (filter, row) =>
                              row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                          }
                        ]
                      },
                      {
                        Header: "Age",
                        columns: [
                          {
                            width: 40,
                            Header: "",
                            accessor: "dob",
                            Cell: row => (
                              <div>{ this.calculateAge(new Date(row.value))}</div>
                            )
                          }
                        ]
                      },
                      {
                        Header: "Register",
                        columns: [
                          {
                            Header: "",
                            accessor: "id",
                            className: 'center',
                            Cell: row => (
                              <FormControlLabel
                                control={
                                  <Checkbox checked={this.isRegistered(row.value)} onChange={this.handleRegister(offer.cost)} value={row.value} />
                                }
                              />
                            )
                          }
                        ]
                      },
                    ]
                    }
                    className="-striped -highlight"
                    pageSize={this.state.registrants.length}
                  />

                  <Button variant="contained" onClick={() => this.saveData()} style={{width: '100%'}}
                      disabled={ this.state.uploading === true ? true:  false}>
                      <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                      Register
                  </Button>

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

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
