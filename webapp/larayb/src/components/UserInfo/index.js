import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

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

class UserInfo extends Component {
  state = {
    phone: '',
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
         <TextField
           required
           id="standard-required"
           label="First Name"
           margin="normal"
           className={classes.textField}
           InputLabelProps={{
             shrink: true,
           }}
         />

         <TextField
           required
           id="standard-required"
           label="Last Name"
           defaultValue=" "
           className={classes.textField}
           margin="normal"
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
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          id="standard-required"
          label="City"

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
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          id="standard-number"
          label="Phone"
          value={this.state.phone}
          onChange={this.handleChange('phone')}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />

      <div>
        <Button variant="contained" size="small" className={classes.button}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>
      </div>

       </form>
    );
  }
}

export default withStyles(styles)(UserInfo);
