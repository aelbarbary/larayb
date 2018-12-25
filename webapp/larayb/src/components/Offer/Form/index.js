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
import OfferOwner from  './OfferOwner.js'
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
  organizationId: '',
  organizationName: '',
  organizationLogo: '',
  organizationWebsite: '',
  description: '',
  datetimeFrom: new Date().toISOString().split(".")[0],
  datetimeTo: new Date().toISOString().split(".")[0],
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

class OfferForm extends Component {
  state = { organizations:[], ...initialState};


  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  //
  // handleImageFile (event) {
  //     var file = event.target.files[0]
  //     this.setState({imageFile: file} )
  // }

  handleOrgChange = event => {
    const selectedOrg = this.state.organizations.filter(  org => org.id === event.target.value )[0]
    this.setState({
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      organizationLogo: selectedOrg.logo,
      organizationWebsite: selectedOrg.website,
      address: selectedOrg.address,
      city: selectedOrg.city,
      state: selectedOrg.state,
      zip: selectedOrg.zip,
      })
  };

  componentWillMount(){
    console.log(new Date().toISOString());
    const {user} =this.props.location.state
    console.log(user);
    var organizations = [];
    firestore.collection("organizations")
    .where("userId", "==", user.userId)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            organizations.push({ id, ...data});
        });
    })
    .then(()=>{
      this.setState({
             organizations: organizations
          });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  saveData (){
    const {user} =this.props.location.state
    SaveOffer(this.state, user.userId)
    .then(() => {
        console.log("Document successfully written!");
        this.setState({ open: true, ...initialState});
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }

  changeOrganizationOfferOwner(selectedOrg){
    console.log(selectedOrg);
    this.setState({
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      organizationLogo: selectedOrg.logo,
      organizationWebsite: selectedOrg.website,
      address: selectedOrg.address,
      city: selectedOrg.city,
      state: selectedOrg.state,
      zip: selectedOrg.zip,
      })
  }

  changeIndividualOfferOwner(name, value){

    this.setState({
      [name]: value,
    });

    console.log(this.state);
  }

  render() {
    const { classes } = this.props;
    const {user} =this.props.location.state;
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

      <OfferOwner user={user} changeOrganizationOfferOwner={this.changeOrganizationOfferOwner.bind(this)}
          changeIndividualOfferOwner={this.changeIndividualOfferOwner.bind(this)} />
      { /*
        <FormControl className={classes.textField} style={{ margin: 8 }}>
          <InputLabel shrink htmlFor="age-label-placeholder">
            Organization
          </InputLabel>
          <Select
            value={this.state.organizationId}
            onChange={this.handleOrgChange}
            input={<Input name="age" id="age-label-placeholder" />}
            displayEmpty
            name="organization"
            className={classes.selectEmpty}
          >
            <MenuItem value="" key="none">
              <em>None</em>
            </MenuItem>
            {
              this.state.organizations.map(function(org, i) {
                return  <MenuItem value={org.id} key={org.id}>
                            {org.name}
                        </MenuItem>
            })
            }
          </Select>

        </FormControl> */}

         <TextField
           id="datetime-local"
           label="From"
           type="datetime-local"
           style={{ margin: 8 }}
           required
           fullWidth
           defaultValue={this.state.datetimeFrom}
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
           defaultValue={this.state.datetimeTo}
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

       {/*<input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={this.handleImageFile.bind(this)}
        />

        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" className={classes.button}>
            Upload an Image
          </Button>
        </label> */}

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
