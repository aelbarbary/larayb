import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {GetOffer} from  '../../../actions/Offer.js';
import {GetRegistrants, SaveRegistrants} from  '../../../actions/Registrant.js';
import {RenderOfferWebsite, RenderOfferPhone, RenderOfferDateTime, RenderOfferCost, RenderOfferEmail} from "../../../common/CommonRenderMethods.js"
import {FormatAddressHelper} from "../../../common/CommonFormatMethods.js"
import Typography from '@material-ui/core/Typography';
import { auth } from '../../../lib/firebase.js';
import ReactTable from "react-table";
import "react-table/react-table.css";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import MySnackBar from  '../../Common/MySnackBar.js';
import './styles.css';
import Grid from '@material-ui/core/Grid';

import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyAQYeNJVtUEzuXGIVPpY9-K0PmcoNLfem8");


const styles = theme => ({
  center:{
    textAlign: 'center'
  },
  responsive:{
    width: '100%',
    height: 'auto'
  },
  cost:{
    color:'gray'
  },
  details:{
    padding: 10
  }
});

class Register extends Component {
  state = {offer: {},
    loading: false,
    registrants:[],
    alertOpen: false,
    alertMessage: '' };

  componentWillMount(){
    this.setState({loading: true});
    const {id} = this.props.match.params;
    GetOffer(id, (data) => {
      this.setState({ offer: data, loading: false})
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
        console.log(this.props.location.pathname);
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

  handleRegister = name => evt => {
   var item = {
     id: evt.target.id,
     name: evt.target.name,
     value: evt.target.value
   };
   var registrants = this.state.registrants.slice();
   var newRegistrants = registrants.map(function(registrant) {
       if (registrant.id === item.value ) {
         registrant['registered'] = !registrant['registered'];
     }
     return registrant;
   });
   this.setState({registrants:newRegistrants});

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

    SaveRegistrants(registrants, user.uid, offerId);

    this.setState({alertOpen: true, alertMessage:'Saved.' });
  }

  render(){
    const { classes } = this.props;
    const {offer} = this.state;

    const phone = RenderOfferPhone (offer);
    const email =RenderOfferEmail(offer);
    const website = RenderOfferWebsite(offer);
    const address = FormatAddressHelper(offer.address,  offer.city, offer.state, offer.zip);

    const addressLink = "http://maps.google.com/?q=" + address;
    const offerDateTime = RenderOfferDateTime(offer);
    const cost = RenderOfferCost(offer);

    return (
      <div>

        <Grid container spacing={24}>
          <Grid item sm={2}/>
          <Grid item  sm={4}>
                <img alt="" src={offer.image}  className={classes.responsive} width={300}/>
          </Grid>
          <Grid item  sm={4}>
            <div className={classes.details}>
                <Typography component="h5" variant="h5">
                  {offer.title}
                </Typography>
                <Typography component="h5" variant="h5">
                  {offer.description}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <a
                    href={addressLink}
                    className={classes.addressLink}
                    target='_blank'
                    rel="noopener noreferrer">
                    {offerDateTime}
                    {address}
                  </a>
                </Typography>

                <div className={classes.controls} style={{width: '100%'}}>
                  {phone}
                  {email}
                  {website}
                </div>

                <h1 className={classes.cost} color="textSecondary">
                  {cost}
                </h1>
            </div>


          </Grid>
          <Grid item  sm={2}/>
        </Grid>

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
                        <Checkbox checked={this.isRegistered(row.value)} onChange={this.handleRegister()} value={row.value} />
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
        <Button variant="contained" onClick={() => this.saveData()} style={{width: '100%', margin: 10}}
            disabled={ this.state.uploading === true ? true:  false}>
            <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
            Save
        </Button>

        <MySnackBar open={this.state.alertOpen} message={this.state.alertMessage} onClosed={() => this.onSnackBarClosed()}></MySnackBar>
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
