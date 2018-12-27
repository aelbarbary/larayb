import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import firebase from '../../../lib/firebase.js';
import TextField from '@material-ui/core/TextField';

const firestore = firebase.firestore();

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
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


class OfferOwner extends React.Component {
  state = {
    value: 0,
    organizationId: '',
    organizations: [],
    individualName: '',
    individualWebsite: '',
    individualImageURL: ''

  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  handleTabChangeIndex = index => {
    this.setState({ value: index });
  };

  componentWillMount(){
    const {user} =this.props;

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

  handleOrgChange = event => {
    const selectedOrg = this.state.organizations.filter(  org => org.id === event.target.value )[0]
    if (selectedOrg){
      this.setState({organizationId: selectedOrg.id})
      this.props.changeOrganizationOfferOwner(selectedOrg);
    }
  };

  handleIndividualChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    this.props.changeIndividualOfferOwner(name, event.target.value);
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Individual" />
            <Tab label="Existing Organization" />

          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleTabChangeIndex}
        >

          <TabContainer dir={theme.direction} >

               <TextField
                 required
                 id="standard-required"
                 label="Name"
                 margin="normal"
                 className={classes.textField}
                 value={this.state.individualName}
                 onChange={this.handleIndividualChange('individualName')}
                 InputLabelProps={{
                   shrink: true,
                 }}
               />

               <TextField
                 required
                 id="standard-required"
                 label="Website"
                 margin="normal"
                 className={classes.textField}
                 value={this.state.individualWebsite}
                 onChange={this.handleIndividualChange('individualWebsite')}
                 InputLabelProps={{
                   shrink: true,
                 }}
               />

               <TextField
                 required
                 id="standard-required"
                 label="Image URL"
                 margin="normal"
                 className={classes.textField}
                 value={this.state.individualImageURL}
                 onChange={this.handleIndividualChange('individualImageURL')}
                 InputLabelProps={{
                   shrink: true,
                 }}
               />

              
          </TabContainer>

          <TabContainer dir={theme.direction}>
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

              </FormControl>
          </TabContainer>

        </SwipeableViews>
      </div>
    );
  }
}

OfferOwner.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(OfferOwner);
