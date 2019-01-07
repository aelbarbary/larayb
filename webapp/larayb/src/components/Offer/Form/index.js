import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import firebase from '../../../lib/firebase.js';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import SaveOffer from  '../../../actions/Offer.js'
import {EditOffer} from  '../../../actions/Offer.js';
import DefaultOffer from  '../../../models/Offer.js'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Switch from '@material-ui/core/Switch';
import GetProviders from  '../../../actions/Provider.js';
import moment from 'moment';

const firestore = firebase.firestore();

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
  margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },

});

const gender = [
  {
    value: 'MALE',
    label: 'Male',
  },
  {
    value: 'FEMALE',
    label: 'Female',
  },
  {
    value: 'ALL',
    label: 'All',
  }
];

const initialState =  {
  ...DefaultOffer,
  provider: {id: ''},
  vertical: 'bottom',
  horizontal: 'center',
  errors: []
};


class OfferForm extends Component {

  state = { ...initialState,  providers:[]};

  handleOfferTypeChange = event => {
    this.setState({ offerType: event.target.value });
  };

  handleSnackBarClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleApprovedChange = name => event => {
      this.setState({ approved: event.target.checked});
  };

  handleProviderChange = event => {
    const selectedProvider = this.state.providers.filter(  provider => provider.id === event.target.value )[0]
    this.setState(
      {
        provider: selectedProvider,
        address: selectedProvider.address,
        city: selectedProvider.city,
        state: selectedProvider.state,
        zip: selectedProvider.zip,
        phone: selectedProvider.phone,
        email: selectedProvider.email
      });
  };

  handleTagDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleTagAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  componentWillMount(){
    console.log(this.props);
    if (this.props.location === undefined || this.props.location.state === undefined){
      this.props.history.push({
          pathname: '/',
        });
    } else {

      if (this.props.match.params.id !== undefined){
        const id = this.props.match.params.id;
        const ref  = firestore.collection("offers").doc(id);
        ref.get().then( (doc) =>  {
              if (doc.exists) {
                  console.log("Document data:", doc.data());
                  const data = doc.data();

                  if (data.provider !== undefined && data.provider.id !== ""  ){
                    firestore.collection("provider")
                    .doc(data.provider.id)
                    .get()
                    .then( (providerDoc) =>  {
                            if (providerDoc.exists) {
                               const provider = { id: providerDoc.id, ...providerDoc.data() };
                               this.setState({provider: provider});
                             }
                           });
                  }

                  this.setState(
                    {
                      title: data.title,
                      description: data.description,
                      offerType: data.offerType,
                      datetimeFrom:  moment(data.datetimeFrom.toDate()).format('YYYY-MM-DDTHH:mm'),
                      datetimeTo: moment(data.datetimeTo.toDate()).format('YYYY-MM-DDTHH:mm'),
                      address: data.address,
                      city: data.city,
                      state: data.state,
                      zip: data.zip,
                      phone: data.phone,
                      contact: data.contact,
                      registrationURL: data.registrationURL,
                      gender: data.gender,
                      cost: data.cost,
                      image: data.image,
                      approved: data.approved,
                      tags: data.tags !== undefined ? data.tags.join(",") : "",
                      userId: data.userId
                    });

              } else {
                  console.log("No such document!");
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });
       }
     }

     GetProviders()
     .then( (querySnapshot) => {
       querySnapshot.forEach((doc) => {
         this.setState({providers: this.state.providers.concat({ id: doc.id, ...doc.data()})});
       });
     });

  }

  saveData (){
    var hasErrors = this.validateInputs();
    if (!hasErrors) {
      const {user} =this.props.location.state;
      if (this.props.match.params.id !== undefined){
        const id = this.props.match.params.id;
        EditOffer(id, this.state, user.userId)
        .then(() => {
            console.log("Document successfully updated!");
            this.setState({ open: true, ...initialState});
            this.props.history.push({
                pathname: '/',
                state: { alertOpen: true,
                      alertMessage: 'Saved Successfully!'
                 }
              })
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      } else {
        SaveOffer(this.state, user.userId)
        .then(() => {
            console.log("Document successfully written!");
            this.setState({ open: true, ...initialState});
            this.props.history.push({
                pathname: '/',
                state: { alertOpen: true,
                      alertMessage: 'Saved Successfully!'
                 }
              })
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      }
    }
  }

  validateInputs(){
    this.setState({errors: []});
    console.log(this.state);
    if (this.state.title.trim() === "" ){
      this.setState({ errors: this.state.errors.concat(['title'])});
      return true;
    }
    if (this.state.provider.id === "" ){
      this.setState({ errors: this.state.errors.concat(['provider'])});
      return true;
    }
    if (this.state.datetimeTo < this.state.datetimeFrom ){
      this.setState({ errors: this.state.errors.concat(['datetimeTo'])});
      return true;
    }
    if (this.state.image.trim() === ""){
      this.setState({ errors: this.state.errors.concat(['image'])});
      return true;
    }
    return false;
  }

  render() {
    const { classes } = this.props;
    const { vertical, horizontal, open } = this.state;
    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
         <TextField
           error={ this.state.errors.includes('title') ? true : false }
           required
           id="standard-required"
           label="Offer Title"
           margin="normal"
           value={this.state.title}
           className={classes.textField}
           onChange={this.handleChange('title')}
           InputLabelProps={{
             shrink: true,
           }}
         />

         <TextField
          id="standard-full-width"
          label="Description"
          style={{ margin: 8 }}
          fullWidth
          multiline
          value={this.state.description}
          rows="4"
          margin="normal"
          onChange={this.handleChange('description')}
          InputLabelProps={{
            shrink: true,
          }}
        />

      <FormControl className={classes.textField} style={{ margin: 8, width: '100%' }} >
          <InputLabel shrink htmlFor="age-label-placeholder">
            Provider
          </InputLabel>
          <Select
            value={this.state.provider.id}
            onChange={this.handleProviderChange}
            input={<Input name="age" id="age-label-placeholder" />}
            displayEmpty
            name="provider"
            error={this.state.errors.includes('provider') ? true: false}
            className={classes.selectEmpty}
          >
            <MenuItem value="" key="none">
              <em>None</em>
            </MenuItem>
            {
              this.state.providers.map(function(provider, i) {
                return  <MenuItem value={provider.id} key={provider.id}>
                            {provider.name}
                        </MenuItem>
            })
            }
          </Select>

        </FormControl>

      <FormLabel component="legend">Offer Type</FormLabel>
        <RadioGroup
          aria-label="Offer Type"
          name="offerType"

          className={classes.group}
          value={this.state.offerType}
          onChange={this.handleOfferTypeChange}
        >
          <FormControlLabel value="activity" control={<Radio />} label="Event/Activity" />
          <FormControlLabel value="product" control={<Radio />} label="Product/Service" />
        </RadioGroup>


         <TextField
           id="datetime-local"
           label="From"
           type="datetime-local"
           style={{ margin: 8}}
           required
           fullWidth
           value={this.state.datetimeFrom}
           onChange={this.handleChange('datetimeFrom')}
           InputLabelProps={{
             shrink: true,
           }}
           margin="normal"
         />

         <TextField
           id="datetime-local"
           label="To"
           error = {this.state.errors.includes('datetimeTo')  ? true : false}
           type="datetime-local"
           style={{ margin: 8 }}
           required
           fullWidth
           value={this.state.datetimeTo}
           onChange={this.handleChange('datetimeTo')}
           InputLabelProps={{
             shrink: true,
           }}
           margin="normal"
         />
         <TextField
          id="standard-full-width"
          label="Every"
          style={{ margin: 8 }}
          required
          margin="normal"
          value={this.state.every}
          onChange={this.handleChange('every')}
          InputLabelProps={{
            shrink: true,
          }}
        />
         <TextField
          id="standard-full-width"
          label="Address"
          style={{ margin: 8 }}
          required
          fullWidth
          margin="normal"
          value={this.state.address}
          onChange={this.handleChange('address')}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          id="standard-required"
          label="City"
          onChange={this.handleChange('city')}
          className={classes.textField}
          margin="normal"
          value={this.state.city}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          id="standard-required"
          label="State"
          className={classes.textField}
          onChange={this.handleChange('state')}
          margin="normal"
          value={this.state.state}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          id="standard-required"
          label="Zip"
          className={classes.textField}
          onChange={this.handleChange('zip')}
          margin="normal"
          value={this.state.zip}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          id="standard-required"
          label="Contact Person"
          className={classes.textField}
          value={this.state.contact}
          onChange={this.handleChange('contact')}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          id="standard-number"
          label="Phone"
          onChange={this.handleChange('phone')}
          className={classes.textField}
          value={this.state.phone}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />

        <TextField
          id="standard-number"
          label="Email"
          onChange={this.handleChange('email')}
          className={classes.textField}
          value={this.state.email}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />

        <TextField
          id="standard-number"
          label="Cost"
          onChange={this.handleChange('cost')}
          type="number"
          className={classes.textField}
          value={this.state.cost}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />

        <TextField
         id="standard-full-width"
         label="Registration URL"
         style={{ margin: 8 }}
         required
         fullWidth
         margin="normal"
         value={this.state.registrationURL}
         onChange={this.handleChange('registrationURL')}
         InputLabelProps={{
           shrink: true,
         }}
       />

       <TextField
          id="standard-select-gender"
          select
          label="Gender"
          style={{ margin: 8 }}
          className={classes.textField}
          onChange={this.handleChange('gender')}
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.gender}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {gender.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
         id="standard-full-width"
         error ={this.state.errors.includes('image') ? true : false}
         label="Image URL"
         style={{ margin: 8 }}
         fullWidth
         margin="normal"
         value={this.state.image}
         onChange={this.handleChange('image')}
         InputLabelProps={{
           shrink: true,
         }}
         />

         <TextField
          id="standard-full-width"
          label="Tags"
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          value={this.state.tags}
          onChange={this.handleChange('tags')}
          InputLabelProps={{
            shrink: true,
          }}
          />

          <Switch
              checked={this.state.approved}
              onChange={this.handleApprovedChange('approved')}
              value="approved"
              color="primary"
            />

        <Button variant="contained" size="small" className={classes.button} onClick={() => this.saveData()}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>
       </form>

       <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleSnackBarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          className={classes.alert}
          message={<span id="message-id">Submitted for Review. Offer should show in home screen as soon as it it approved.</span>}
        />
     </div>
    );
  }
}

export default withStyles(styles)(OfferForm);
