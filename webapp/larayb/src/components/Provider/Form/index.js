import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DefaultProvider from  '../../../models/Provider.js';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';
import {GetProvider, InsertProvider, EditProvider} from  '../../../actions/Provider.js';
import MySnackBar from  '../../Common/MySnackBar.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from '../../../lib/firebase.js';
import loading from '../../../assets/images/loading.gif'

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
  },
  card: {
    margin: 20,
  },
  saveButton:{
    width: '100%',
    marginTop: 10
  },
  input: {
    display: 'none',
  },
});

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
         logoError: false,
         alertOpen: false,
         alertMessage: '',
         providerLogoUrlOpen: false,
         uploading: false
       };

       this.providerLogoURLRef = React.createRef();
     }

   handleChange = name => event => {
     this.setState({
       [name]: event.target.value,
       alertOpen: false
     });

   };

   componentWillMount(){
     const {providerId} = this.props;
     if (providerId !== undefined){
       GetProvider(providerId, (data) => { this.setState({ ...data}) });
    }
   }

   save(){
     var errors = this.validateInputs();
     const {user, providerId, goBack} =this.props;
     if (!errors){

       if (providerId !== undefined){
         EditProvider( providerId, this.state );
         goBack();
       } else{
         InsertProvider(this.state, user.userId)
         .then((docRef) =>  {
           this.setState({providerId: docRef.id});
           goBack();
         });
       }
       this.setState({alertOpen: true, alertMessage:'Saved.' });
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
     if (logo=== undefined || logo.trim() === '' ){
       this.setState({logoError : true });
       hasErrors = true;
     }
     return hasErrors;
   }

   handleLogoFile (event) {
       var file = event.target.files[0]
       this.setState({logoFile: file} )
   }


  handleClose() {
    this.setState({ alertOpen: false, alertMessage: '' });
  };


  handleproviderLogoUrlOpen = () => {
    this.setState({ providerLogoUrlOpen: true });
  };

  handleProviderLogoURLClose = () => {
    this.setState({ providerLogoUrlOpen: false });
  };

  handleProviderLogoURLSave = (e) => {
    this.setState({ logo:  this.providerLogoURLRef.current.value.toString()});
    this.handleProviderLogoURLClose();
  };

  handleProviderLogoUploaded(event) {
    this.setState({uploading: true});
    var file = event.target.files[0]
    this.setState({logoFile: file} )
    var storageRef = firebase.storage().ref();
    let fileName = Date.now() + file.name;
    storageRef.child(fileName)
      .put(file)
      .then(() => {
        storageRef.child(fileName)
                   .getDownloadURL()
                   .then((url) => {
                     this.setState({logo: url, uploading: false});
        });
      });

  }

  render() {
    const { classes } = this.props;

    return (

        <form className={classes.container} noValidate autoComplete="off">
          <h2 className={classes.textField}>New Provider</h2>
         <TextField
           error={this.state.nameError ? true : false}
           autoFocus
           required
           id="name"
           label="Name"
           fullWidth
           style={{ margin: 8 }}
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

    {/* <TextField
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
       /> */}
       <div>
         <Button className={classes.imageButton} onClick={this.handleproviderLogoUrlOpen} variant="contained" component="span">
           Enter Image URL
         </Button>
         <label> OR </label>
         <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={this.handleProviderLogoUploaded.bind(this)}
          />
        <label htmlFor="contained-button-file" className={classes.imageButton} variant="contained">
            <Button variant="contained" component="span" >
              Upload
            </Button>
          </label>
      </div>

       <Dialog
          open={this.state.providerLogoUrlOpen}
          onClose={this.handleProviderLogoURLClose}
          aria-labelledby="form-dialog-title"

        >
          <DialogTitle id="form-dialog-title">Provider Logo URL</DialogTitle>
          <DialogContent>
            <textarea
              ref={this.providerLogoURLRef}
              id="providerLogoURL"
              label="Provier Logo URL"
              autoFocus
              rows="4"
              style={{width: 400}}
              defaultValue={this.state.logo}
              onChange={this.handleChange('logo')}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProviderLogoURLClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleProviderLogoURLSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{textAlign: 'center', justifyContent: 'center', width: '100%'}} >
          {this.state.uploading && <img src={loading} alt="uploading"></img> }
          {this.state.uploading === false && <img src={this.state.logo} alt="" style={{maxWidth: 400}}></img>}
        </div>
       <Button variant="contained" size="small" className={classes.saveButton} onClick={() => this.save()} disabled={ this.state.uploading === true ? true:  false}>
         <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
         Save
       </Button>

      <MySnackBar open={this.state.alertOpen} message={this.state.alertMessage} ></MySnackBar>
      </form>

    );
  }
}

ProviderForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProviderForm);
