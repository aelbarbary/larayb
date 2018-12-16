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

class NewOffer extends Component {
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
           InputLabelProps={{
             shrink: true,
           }}
         />

         <TextField
           required
           id="standard-required"
           label="Organization"
           defaultValue=""
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
          required
          id="standard-required"
          label="Contact Person"
          defaultValue=""
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

        <TextField
          id="datetime-local"
          label="Date/Time"
          type="datetime-local"
          defaultValue="2017-05-24T10:30"
          style={{ margin: 8 }}
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"

        />


        <Button variant="contained" size="small" className={classes.button}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>





       </form>
    );
  }
}

export default withStyles(styles)(NewOffer);
