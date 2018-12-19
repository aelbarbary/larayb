import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import firebase from '../../lib/firebase.js';
import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';

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
  alert:{

  }
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
  title: '',
  organization: '',
  description: '',
  datetime: '2018-01-01',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  contact: '',
  registrationURL: '',
  gender: '',
  userId: '',
  image: '',
  cost: 0,
  vertical: 'bottom',
  horizontal: 'center',
};

class NewOffer extends Component {
  state = initialState;

handleClose = () => {
  this.setState({ open: false });
};

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleFile (event) {
      var file = event.target.files[0]
      console.log(this.state);
      this.setState({image: file} )
      console.log(this.state);
  }

  saveData (){
    console.log("saving");
    console.log(this.state.image);
    var storageRef = firebase.storage().ref();

    storageRef.child(this.state.image.name)
    .put(this.state.image)
    .then(() => {
      storageRef.child(this.state.image.name).getDownloadURL().then((url) => {

        firestore.collection("offers").add({
          title: this.state.title,
          organization: this.state.organization,
          description: this.state.description,
          datetime: new Date(Date.parse(this.state.datetime)),
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zip,
          phone: this.state.phone,
          contact: this.state.contact,
          registrationURL: this.state.registrationURL,
          gender: this.state.gender,
          userId: this.props.match.params.userId,
          image: url,
          cost: this.state.cost,
          approved: 0,
        })
        .then(() => {
            console.log("Document successfully written!");
            this.setState({ open: true, ...initialState});
            ;

            })
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      });

  }

  render() {
    const { classes } = this.props;
    // const {userid} = this.props;
    console.log(this.props.match.params.userId);
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

         <TextField
           required
           id="standard-required"
           label="Organization"
           className={classes.textField}
           onChange={this.handleChange('organization')}
           margin="normal"
           value={this.state.organization}
           InputLabelProps={{
             shrink: true,
           }}
         />

         <TextField
           id="datetime-local"
           label="Date/Time"
           type="datetime-local"
           style={{ margin: 8 }}
           required
           fullWidth
           value={this.state.dateTime}
           onChange={this.handleChange('datetime')}
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
          id="standard-select-currency"
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

        <input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple

          type="file"
          onChange={this.handleFile.bind(this)}
        />

        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" className={classes.button}>
            Upload
          </Button>
        </label>

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

export default withStyles(styles)(NewOffer);
