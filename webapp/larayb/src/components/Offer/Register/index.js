import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {GetOffer} from  '../../../actions/Offer.js';
import {GetProfile} from  '../../../actions/Profile.js';
import {RenderOfferWebsite, RenderOfferPhone, RenderOfferDateTime, RenderOfferCost, RenderOfferEmail} from "../../../common/CommonRenderMethods.js"
import {FormatAddressHelper} from "../../../common/CommonFormatMethods.js"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { auth } from '../../../lib/firebase.js';
import ReactTable from "react-table";
import "react-table/react-table.css";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

const styles = theme => ({

});

class Register extends Component {
  state = {offer: {}, loading: false, profile:{dependents: []} };

  componentWillMount(){
    this.setState({loading: true});
    const {id} = this.props.match.params;
    GetOffer(id, (data) => { this.setState({ offer: data, loading: false}) });
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        GetProfile(user.uid, (profile)=>{

          this.setState({ profile: profile });
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
   var dependents = this.state.profile.dependents.slice();
   var newDependents = dependents.map(function(dependent) {
       if (dependent.id === item.value ) {
         dependent['registered'] = !dependent['registered'];
     }
     return dependent;
   });
   this.setState({dependents:newDependents});
 };

  isRegistered(value){
    var dependents = this.state.profile.dependents.slice();
    dependents.map(function(dependent) {
        if (dependent.id === value ) {
          return dependent.registered;
      }
      return false;
    });
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

      <Card className={classes.card} >

        <div className={classes.details} style={{width: '100%', textAlign:'center'}}>
          <CardContent className={classes.content} >
            <div id="avatar-rahmy">
              <img alt="" src={offer.image}  className={classes.avatar}/>
            </div>
            <Typography component="h5" variant="h5">
              {offer.title}
            </Typography>
            <Typography component="h8" variant="h8">
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
          </CardContent>
          <div className={classes.controls} style={{textAlign: 'center', justifyContent:'center', width: '100%'}}>
            {phone}
            {email}
            {website}
            {cost}
          </div>
        </div>
        <div className={classes.grow} />

        </Card>

        <ReactTable
          data={this.state.profile.dependents}
          showPagination={false}
          columns={[
            {
              Header: "First Name",
              columns: [
                {
                  Header: "",
                  accessor: "firstName",
                  filterMethod: (filter, row) =>
                    row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                }
              ]
            },
            {
              Header: "Last Name",
              columns: [
                {
                  Header: "",
                  accessor: "lastName",
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
                  Header: "",
                  accessor: "dob",
                  Cell: row => (
                    <span>{ this.calculateAge(new Date(row.value))}</span>
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
                  Cell: row => (
                    <FormControlLabel
                      control={
                        <Checkbox checked={this.isRegistered(row.value)} onChange={this.handleRegister()} value={row.value} />
                      }
                      label={row.value}
                    />
                  )
                }
              ]
            },
          ]
          }
          className="-striped -highlight"
          pageSize={this.state.profile.dependents.length}

        />
        <Button variant="contained" onClick={() => this.saveData()} style={{width: '100%', margin: 10}}
            disabled={ this.state.uploading === true ? true:  false}>
            <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
            Save
        </Button>
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
