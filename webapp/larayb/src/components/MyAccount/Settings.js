import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import MySnackBar from  '../Common/MySnackBar.js';
import {SaveSettings, EditSettings, GetSettings}  from  '../../actions/Settings.js'

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

class Settings extends Component {

  state = { errors: [], facebookPage: '', instagramProfile:'' };

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

  componentWillReceiveProps(nextProps){

  }

  componentDidMount(){
    const {user } = this.props;
    GetSettings(user.userId, (settings) => {
      this.setState({ ...settings });
    });
  }

  saveData (){
    var hasErrors = this.validateInputs();
    if (!hasErrors) {
      const {user } = this.props;
      if (this.state.id !== undefined){
        EditSettings(this.state.id, this.state, user.userId);
      } else {
        SaveSettings(this.state, user.userId)
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

  render() {
    const { classes } = this.props;
    return (
      <div style={{height: 600}}>
        <form className={classes.container} noValidate autoComplete="off">

         <h1>My Account Settings</h1>
         <TextField
           error={ this.state.errors.includes('title') ? true : false }
           required
           fullWidth
           autoFocus
           id="standard-required"
           label="Facebook Page"
           margin="normal"
           value={this.state.facebookPage}
           className={classes.textField}
           onChange={this.handleChange('facebookPage')}
           InputLabelProps={{
             shrink: true,
           }}
         />
         <TextField
           error={ this.state.errors.includes('title') ? true : false }
           required
           fullWidth
           id="standard-required"
           label="Instagram Profile"
           margin="normal"
           value={this.state.instagramProfile}
           className={classes.textField}
           onChange={this.handleChange('instagramProfile')}
           InputLabelProps={{
             shrink: true,
           }}
         />



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

export default withStyles(styles)(Settings);
