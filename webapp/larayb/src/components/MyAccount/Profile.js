import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import MySnackBar from  '../Common/MySnackBar.js';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Dependents from './Dependents.js';
import {SaveProfile, EditProfile, GetProfile}  from  '../../actions/Profile.js'

const gender = [
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  }
];

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

class Profile extends Component {

  state = {
    errors: [],
    firstName: '',
    lastName: '',
    dob: '',
    facebookPage: '',
    instagramProfile: '',
    gender: '',
    dependents: [

    ]
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
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

  componentDidMount(){
    const {user } = this.props;
    GetProfile(user.userId, (profile) => {
      this.setState({ ...profile });
    });
  }

  saveData (){
    var hasErrors = this.validateInputs();
    if (!hasErrors) {
      const {user} = this.props;
      if (this.state.id !== undefined){
        EditProfile(this.state.id, this.state, user.userId);
      } else {
        SaveProfile(this.state, user.userId)
        .then((docRef) =>  {
          this.setState({id: docRef.id})
       });
      }
      this.setState({alertOpen: true, alertMessage:'Saved.' });
    }
  }

  validateInputs(){
    return false;
  }

  updateDependents(dependents){
    this.setState({dependents: dependents});
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">

         <h1>My Profile</h1>
         <Grid container>
           <TextField
             error={ false }
             required
             autoFocus
             id="standard-required"
             label="First Name"
             margin="normal"
             value={this.state.firstName}
             className={classes.textField}
             onChange={this.handleChange('firstName')}
             InputLabelProps={{
               shrink: true,
             }}
           />
           <TextField
             error={ this.state.errors.includes('title') ? true : false }
             required
             id="standard-required"
             label="Last Name"
             margin="normal"
             value={this.state.lastName}
             className={classes.textField}
             onChange={this.handleChange('lastName')}
             InputLabelProps={{
               shrink: true,
             }}
           />

           <TextField
             id="date"
             label="Birth Date"
             type="date"
             style={{ margin: 8}}
             required
             fullWidth
             value={this.state.dob}
             onChange={this.handleChange('dob')}
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
              default
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

            <Grid container>
              <h3>Dependents</h3>
              <Grid container>
              <Dependents dependents={this.state.dependents} updateDependents={this.updateDependents.bind(this)}/>
              </Grid>
            </Grid>
         </Grid>

      <Button variant="contained" onClick={() => this.saveData()} style={{ margin: 10}}
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

export default withStyles(styles)(Profile);
