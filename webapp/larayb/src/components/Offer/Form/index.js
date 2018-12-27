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
import {EditOffer} from  '../../../actions/Offer.js'
import DefaultOffer from  '../../../models/Offer.js'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
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
  provider: {},
  vertical: 'bottom',
  horizontal: 'center',
};

class OfferForm extends Component {
  state = { providers:[], ...initialState, offerType: 'activity', provider:{}};

  handleOfferTypeChange = event => {
    this.setState({ offerType: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleProviderChange = event => {
    const selectedProvider = this.state.providers.filter(  provider => provider.id === event.target.value )[0]
    console.log(selectedProvider);
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

  componentWillMount(){
    const {user} =this.props.location.state

    var providers = [];
    firestore.collection("provider")
    .where("userId", "==", user.userId)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            providers.push({ id, ...data});
        });
    })
    .then(()=>{
      this.setState({
             providers: providers
          });
    })
    .catch(function(error) {
        console.log("Error getting providers: ", error);
    });

    if (this.props.match.params.id !== undefined){
      const id = this.props.match.params.id;
      const ref  = firestore.collection("offers").doc(id);
      ref.get().then( (doc) =>  {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                const data = doc.data();

                if (data.providerId !== undefined){
                  firestore.collection("provider")
                  .doc(data.providerId)
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
                    datetimeFrom: data.datetimeFrom.toDate().toISOString().split(".")[0],
                    datetimeTo: data.datetimeTo.toDate().toISOString().split(".")[0],
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

  saveData (){
    const {user} =this.props.location.state;
    console.log(this.props.match.params.id);
    if (this.props.match.params.id !== undefined){
      const id = this.props.match.params.id;
      console.log("editing");
      EditOffer(id, this.state, user.userId)
      .then(() => {
          console.log("Document successfully updated!");
          this.setState({ open: true, ...initialState});
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    } else {
      console.log("saving");
      SaveOffer(this.state, user.userId)
      .then(() => {
          console.log("Document successfully written!");
          this.setState({ open: true, ...initialState});
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    }
  }

  // changeIndividualOfferOwner(name, value){
  //
  //   this.setState({
  //     [name]: value,
  //   });
  // }

  render() {
    const { classes } = this.props;
    const { vertical, horizontal, open } = this.state;
    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
         <TextField
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
            fullWidth
            name="provider"
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
          fullWidth
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
          type="number"
          className={classes.textField}
          value={this.state.phone}
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

        <Button variant="contained" size="small" className={classes.button} onClick={() => this.saveData()}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>
       </form>

       <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleClose}
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
