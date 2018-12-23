import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import qwest from 'qwest';
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
// import Paper from '@material-ui/core/Paper';


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

const initialState =  {
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  contact: '',
  website: '',
  facebook: '',
  instagram: '',
  twitter: '',
  vertical: 'bottom',
  horizontal: 'center',
  open: false
};


function Transition(props) {
  return <Slide direction="up" {...props} />;
}


class OrganizationForm extends Component {

  constructor(props) {
       super(props);
       this.state = initialState;
   }

   handleChange = name => event => {
     this.setState({
       [name]: event.target.value,
     });
   };

   handleLogoFile (event) {
       var file = event.target.files[0]
       this.setState({logoFile: file} )
   }

   save (){
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
            this.addOrganization(url);
         });
       });
     } else{
       this.addOrganization(this.state.logo);
     }
   }

   addOrganization(url){
     const {user}  = this.props;
     firestore.collection("organizations").add({
       name: this.state.name,
       description: this.state.description,
       address: this.state.address,
       city: this.state.city,
       state: this.state.state,
       zip: this.state.zip,
       phone: this.state.phone,
       contact: this.state.contact,
       website: this.state.website,
       facebook: this.state.facebook,
       instagram: this.state.instagram,
       logo: url,
       userId: user.userId
     })
     .then(() => {
         console.log("Organization successfully written!");
         this.setState({ open: true, ...initialState});
      })
     .catch(function(error) {
         console.error("Error writing organization: ", error);
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
              New Organization
            </Typography>
            <Button color="inherit" onClick={() => this.save() }>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <form className={classes.container} noValidate autoComplete="off">
         <TextField
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
         id="standard-full-width"
         label="Website"
         style={{ margin: 8 }}
         required
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
          Upload Organization Logo
        </Button>
      </label>

       </form>
      </Dialog>

    );
  }
}

OrganizationForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrganizationForm);
