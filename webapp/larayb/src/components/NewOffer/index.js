import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import firebase from '../../lib/firebase.js';
import MenuItem from '@material-ui/core/MenuItem';

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

class NewOffer extends Component {
  state = {
    phone: '',
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
    console.log(this.state.title);
    console.log(this.state.image);
    var storageRef = firebase.storage().ref();

    storageRef.child(this.state.image.name).put(this.state.image).then(function(snapshot) {
      console.log(snapshot);
    });;

    firestore.collection("offers").add({
      title: this.state.title,
      organization: this.state.organization,
      city: this.state.city,
      state: this.state.state,
      address: this.state.address,
      zip: this.state.zip,
      contact: this.state.contact,
      phone: this.state.phone,
      datetime: this.state.datetime,
      userId: this.props.match.params.userId,
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }



  render() {
    const { classes } = this.props;
    // const {userid} = this.props;
    console.log(this.props.match.params.userId);
    return (
      <form className={classes.container} noValidate autoComplete="off">
         <TextField
           required
           id="standard-required"
           label="Offer Title"
           margin="normal"
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
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          id="standard-required"
          label="Contact Person"
          className={classes.textField}
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
          value="ALL"
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
    );
  }
}

export default withStyles(styles)(NewOffer);
