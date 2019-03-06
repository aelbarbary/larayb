import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import SaveOffer, {EditOffer}  from  '../../../actions/Offer.js'
import DefaultOffer from  '../../../models/Offer.js'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Switch from '@material-ui/core/Switch';
import {GetProviders} from  '../../../actions/Provider.js';
import {GetOffer} from  '../../../actions/Offer.js';
import moment from 'moment';
import { WithContext as ReactTags } from 'react-tag-input';
import MySnackBar from  '../../Common/MySnackBar.js';
import firebase from '../../../lib/firebase.js';
import loading from '../../../assets/images/loading.gif'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
  tagsClass:{
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%'
  },
  tagInputClass:{
    display: 'inline-block'
  },
  tagInputFieldClass:{

  },
  selectedClass:{

  },
  tagClass:{
    borderRadius: 10,
    borderColor: 'gray',
    borderStyle: 'solid',
    fontSize: 15,
    borderWidth: 2,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
  },
  removeClass:{

  },
  suggestionsClass:{

  },
  activeSuggestionClass:{

  },
  input: {
    display: 'none',
  },
  margin: {
   // margin: theme.spacing.unit,
   marginTop: 20
 },

});

const gender = [
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  },
  {
    value: 'ALL',
    label: 'All',
  }
];

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const initialState =  {
  ...DefaultOffer,
  provider: {id: ''},
  vertical: 'bottom',
  horizontal: 'center',
  errors: [],
  alertOpen: false,
  alertMessage: '',
  tags:[],
  offerImageUrlOpen: false,
  uploading: false,
};


class OfferForm extends Component {

  constructor(props){
    super(props);
    this.offerImageURLRef = React.createRef();
  }
  state = { ...initialState,  providers:[], suggestions: [], tags: []};

  handleOfferTypeChange = event => {
    let type = event.target.value;
    this.setState({ offerType: type });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSwitchChange = name => event => {
      this.setState({ [name]: event.target.checked});
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
        website: selectedProvider.website,
        email: selectedProvider.email
      });
  };

  handleTagDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleTagAddition (tag) {
    this.setState({ tags: [...this.state.tags, tag] })
  }

  handleOfferImageUrlOpen = () => {
    this.setState({ offerImageUrlOpen: true });
  };

  handleOfferImageURLClose = () => {
    this.setState({ offerImageUrlOpen: false });
  };

  handleOfferImageURLSave = (e) => {
    console.log(this.offerImageURLRef.current.value.toString());
    this.setState({ image:  this.offerImageURLRef.current.value.toString()});
    this.handleOfferImageURLClose();
  };

  handleOfferImageUploaded(event) {
    this.setState({uploading: true});
    var file = event.target.files[0]
    var storageRef = firebase.storage().ref();
    let fileName = Date.now() + file.name;
    storageRef.child(fileName)
      .put(file)
      .then(() => {
        storageRef.child(fileName)
                   .getDownloadURL()
                   .then((url) => {
                     this.setState({image: url, uploading: false});
        });
      });
  }

  componentWillMount(){
    const {user, offerId} =this.props;
    if (offerId !== undefined){
      this.loadOffer(offerId);
    }

   GetProviders(user.userId, providers => {
     this.setState({providers: providers});
   });
  }

  loadOffer(offerId){
    GetOffer(offerId, (data) => {
      console.log(offerId);
      if (data.provider !== undefined && data.provider.id !== "" ){
        this.setState({provider: data.provider});
      }

      const tags = data.tags.map( (tag) =>  ( { id: tag, text: tag} ));
      this.setState(
        {
          ...data,
          datetimeFrom:  moment(data.datetimeFrom.toDate()).format('YYYY-MM-DDTHH:mm'),
          datetimeTo: moment(data.datetimeTo.toDate()).format('YYYY-MM-DDTHH:mm'),
          every: data.every === undefined ? '': data.every ,
          tags: tags,
        });
    });
  }

  saveData (){
    var hasErrors = this.validateInputs();
    if (!hasErrors) {
      const {user, offerId, goBack} =this.props;
      if (offerId !== undefined){
        EditOffer(offerId, this.state, user.userId);
        goBack();
      } else {
        SaveOffer(this.state, user.userId)
        .then((docRef) =>  {
          this.setState({offerId: docRef.id});
          goBack();
       });
      }
      this.setState({alertOpen: true, alertMessage:'Saved.' });
    }
  }

  validateInputs(){
    this.setState({ titleError: false, providerError: false, datetimeToError: false, imageError: false });
    if (this.state.title.trim() === "" ){
      this.setState({titleError: true });
      return true;
    }
    if (this.state.provider.id === "" ){
      this.setState({ providerError: true });
      return true;
    }
    if (this.state.datetimeTo < this.state.datetimeFrom ){
      this.setState({ datetimeToError: true });
      return true;
    }
    if (this.state.image.trim() === ""){
      this.setState({ imageError: true });
      return true;
    }
    return false;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <h2 className={classes.textField}>New Offer</h2>

         <TextField
           error={ this.state.titleError }
           required
           fullWidth
           autoFocus
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
            error={this.state.providerError }
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

        <InputLabel shrink htmlFor="age-label-placeholder" className={classes.textField}>
          Offer Type
        </InputLabel>

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

         <div style={{display: this.state.offerType === "activity" ? 'contents': 'none'}}>
           <TextField
             id="datetime-local"
             label="From"
             type="datetime-local"
             style={{ margin: 8, }}
             required
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
             error = {this.state.datetimeToError}
             type="datetime-local"
             style={{ margin: 8 }}
             required
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

          <FormControlLabel
            className={classes.textField}
              control={
                <Switch
                    checked={this.state.fullDay}
                    onChange={this.handleSwitchChange('fullDay')}
                    color="primary"
                  />
            }
            label="Full Day"
            />

          <Grid container>
              <FormControlLabel
                className={classes.textField}
                  control={
                    <Switch
                        checked={this.state.useLaraybRegistrationSystem}
                        onChange={this.handleSwitchChange('useLaraybRegistrationSystem')}
                        color="primary"
                      />
                }
                label="Use LARAYB Registration System"
                />
              <div style={{ display: this.state.useLaraybRegistrationSystem? 'none': 'contents' }}>
                  <TextField
                   id="standard-full-width"
                   label="Registration URL"
                   style={{ margin: 8, width: 300}}
                   required
                   margin="normal"
                   value={this.state.registrationURL}
                   onChange={this.handleChange('registrationURL')}
                   InputLabelProps={{
                     shrink: true,
                   }}
                 />
              </div>
            </Grid>

         </div>
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
          label="Website"
          onChange={this.handleChange('website')}
          className={classes.textField}
          value={this.state.website}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />

        <TextField
          id="standard-number"
          label="Cost"
          onChange={this.handleChange('cost')}
          className={classes.textField}
          value={this.state.cost}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
      
       <TextField
          id="standard-select-gender"
          select
          label="Gender"
          style={{ margin: 8, width: 300 }}
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

       <div style={{display: 'block', width: '100%'}}>
        <ReactTags tags={this.state.tags}

          suggestions={this.state.suggestions}
          handleDelete={this.handleTagDelete.bind(this)}
          handleAddition={this.handleTagAddition.bind(this)}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
          autofocus={false}
          classNames={{
            tags: classes.tagsClass,
            tagInput: classes.tagInputClass,
            tagInputField: classes.tagInputFieldClass,
            selected: classes.selectedClass,
            tag: classes.tagClass,
            remove: classes.removeClass,
            suggestions: classes.suggestionsClass,
            activeSuggestion: classes.activeSuggestionClass
          }}/>
      </div>

      <Grid container>
      <FormControlLabel
        className={classes.textField}
          control={
            <Switch
                checked={this.state.active}
                onChange={this.handleSwitchChange('active')}
                color="primary"
              />
        }
        label="Active"
        />
    </Grid>

        <div>
          <Button className={classes.imageButton} onClick={this.handleOfferImageUrlOpen}
            variant="contained" component="span" style={{color: this.state.imageError?  'red': 'black'}}>
            Enter Image URL
          </Button>
          <label> OR </label>
          <input
             accept="image/*"
             className={classes.input}
             id="contained-button-file"
             multiple
             type="file"
             onChange={this.handleOfferImageUploaded.bind(this)}
           />
         <label htmlFor="contained-button-file" className={classes.imageButton} variant="contained">
             <Button variant="contained" component="span" style={{color: this.state.imageError?    'red': 'black'}}>
               Upload
             </Button>
           </label>
       </div>


        <Dialog
           open={this.state.offerImageUrlOpen}
           onClose={this.handleOfferImageURLClose}
           aria-labelledby="form-dialog-title"

         >
           <DialogTitle id="form-dialog-title">Offer Image URL</DialogTitle>
           <DialogContent >
             <textarea
               ref={this.offerImageURLRef}
               id="offerImageURL"
               label="Offer Image URL"
               defaultValue={this.state.image}
               autoFocus
               rows="4"
               onChange={this.handleChange('image')}
               style={{width: 400}}
             />
           </DialogContent>

           <DialogActions>
             <Button onClick={this.handleOfferImageURLClose} color="primary">
               Cancel
             </Button>
             <Button onClick={this.handleOfferImageURLSave} color="primary">
               Save
             </Button>
           </DialogActions>
         </Dialog>

         <div style={{textAlign: 'center', justifyContent: 'center', width: '100%'}} >
           {this.state.uploading && <img src={loading} alt="uploading"></img> }
           {this.state.uploading === false && <img src={this.state.image} alt="" style={{maxWidth: 400}}></img>}
         </div>

      <Button variant="contained" onClick={() => this.saveData()} style={{width: '100%', margin: 10}}
          disabled={ this.state.uploading === true ? true:  false}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>
       </form>

       <MySnackBar open={this.state.alertOpen} message={this.state.alertMessage} ></MySnackBar>

     </div>
    );
  }
}

export default withStyles(styles)(OfferForm);
