import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import firebase from '../../../lib/firebase.js';
import DefaultProvider from  '../../../models/Provider.js';

const firestore = firebase.firestore();

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    flexGrow: 1,
    marginTop: 20
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  card: {
    margin: 20,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProviderForm extends Component {

  constructor(props) {
       super(props);
       this.state = {
         ...DefaultProvider,
         vertical: 'bottom',
         horizontal: 'center',
         open: false,
         nameError: false,
         cityError: false,
         stateError: false,
         logoError: false
       };
     }

   handleChange = name => event => {
     this.setState({
       [name]: event.target.value,
     });

   };



   save(){
     console.log("saving");
     var errors = this.validateInputs();
     if (!errors){
       var storageRef = firebase.storage().ref();
       if (this.state.logoFile !== undefined)
       {
         console.log("saving file");
         storageRef.child(this.state.logoFile.name)
         .put(this.state.logoFile)
         .then(() => {
           storageRef.child(this.state.logoFile.name)
                      .getDownloadURL()
                      .then((url) => {
              this.addProvider(url);
           });
         });
       } else{
         this.addProvider(this.state.logo);
       }
     }
   }

   validateInputs(){
     this.setState({ nameError: false, cityError: false, stateError: false, logoError: false });
     let hasErrors = false;
     const {name, city, state, logo} = this.state;

     if (name.trim() === '' ){
       this.setState({nameError : true});
       hasErrors = true;
     }
     if (city=== undefined || city.trim() === '' ){
       this.setState({cityError : true});
       hasErrors = true;
     }
     if (state=== undefined || state.trim() === '' ){
       this.setState({stateError : true});
       hasErrors = true;
     }
     if (logo=== undefined || logo.trim() === '' || !logo.startsWith("https") ){
       this.setState({logoError : true });
       hasErrors = true;
     }
     return hasErrors;
   }

   handleLogoFile (event) {
       var file = event.target.files[0]
       this.setState({logoFile: file} )
   }

   addProvider(url){
     const {user}  = this.props;
     firestore.collection("provider").add({
       name: this.state.name,
       description: this.state.description,
       address: this.state.address,
       city: this.state.city,
       state: this.state.state,
       zip: this.state.zip,
       phone: this.state.phone,
       email: this.state.email,
       contact: this.state.contact,
       website: this.state.website,
       facebook: this.state.facebook,
       instagram: this.state.instagram,
       logo: url,
       userId: user.userId
     })
     .then(() => {
         console.log("Provider successfully written!");
         this.props.getProviders(user.userId);
      })
     .catch(function(error) {
         console.error("Error writing provider: ", error);
     });
   }

   componentWillReceiveProps(nextProps) {
      this.setState({
        open: nextProps.open
      });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (

      <Dialog
        fullScreen
        open={this.state.open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              New Provider
            </Typography>
            <Button color="inherit" onClick={() => this.save() }>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <form className={classes.container} noValidate autoComplete="off">
         <TextField
           error={this.state.nameError ? true : false}
           autoFocus
           required
           id="standard-required"
           label="Name"
           margin="normal"
           value={this.state.name}
           className={classes.textField}
           onChange={this.handleChange('name')}
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
          id="standard-full-width"
          label="Address"
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          value={this.state.address}
          onChange={this.handleChange('address')}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          error={this.state.cityError ? true : false}
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
          error={this.state.stateError ? true : false}
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
         id="standard-full-width"
         label="Email"
         style={{ margin: 8 }}
         fullWidth
         margin="normal"
         value={this.state.email}
         onChange={this.handleChange('email')}
         InputLabelProps={{
           shrink: true,
         }}
       />

        <TextField
         id="standard-full-width"
         label="Website"
         style={{ margin: 8 }}
         fullWidth
         margin="normal"
         value={this.state.website}
         onChange={this.handleChange('website')}
         InputLabelProps={{
           shrink: true,
         }}
       />

       <TextField
        id="standard-full-width"
        label="Facebook"
        style={{ margin: 8 }}
        fullWidth
        margin="normal"
        value={this.state.facebook}
        onChange={this.handleChange('facebook')}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
       id="standard-full-width"
       label="Instagram"
       style={{ margin: 8 }}
       fullWidth
       margin="normal"
       value={this.state.instagram}
       onChange={this.handleChange('instagram')}
       InputLabelProps={{
         shrink: true,
       }}
     />

     <TextField
      id="standard-full-width"
      label="Twitter"
      style={{ margin: 8 }}
      fullWidth
      margin="normal"
      value={this.state.twitter}
      onChange={this.handleChange('twitter')}
      InputLabelProps={{
        shrink: true,
      }}
      />

      <TextField
       error={this.state.logoError ? true : false}
       id="standard-full-width"
       label="Logo URL (https://)"
       style={{ margin: 8 }}
       fullWidth
       margin="normal"
       value={this.state.logo}
       onChange={this.handleChange('logo')}
       InputLabelProps={{
         shrink: true,
       }}
       />

      <input
        accept="image/*"
        className={classes.input}
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={this.handleLogoFile.bind(this)}
      />

      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span" className={classes.button}>
          Upload Provider Logo
        </Button>
      </label>

       </form>
      </Dialog>

    );
  }
}

ProviderForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProviderForm);
