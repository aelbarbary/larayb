import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import firebase from '../../lib/firebase.js';
import NewOrganization from '../NewOrganization/index';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  card: {
    margin: 20,
  },
  logo: {
    width:40
  },
});

class Organizations extends React.Component {
  state = {open: false, organizations:[]};

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentWillMount(){
    var organizations = [];
    firestore.collection("organizations")
    // .where("userId", "==", this.props.user.userId)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            organizations.push(doc.data());
        });
        console.log(querySnapshot);
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


  render() {
    const { classes, user } = this.props;
    console.log(user);
    const organizations = this.state.organizations.map((org, i) =>
            <Grid item zeroMinWidth>
              <Card className={classes.card}>
      <CardHeader
        avatar={
          <img aria-label="Recipe" className={classes.logo} src={org.logo} alt={org.name}>

          </img>
        }
        title={org.name}
        subheader={org.address + ", " + org.city + ", " + org.state + " " + org.zip}
      />

      <CardContent>
        <Typography component="p">
          {org.description}
        </Typography>
      </CardContent>


    </Card>
            </Grid>
      );

    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Create New Organization
        </Button>
        <NewOrganization user={user} open={this.state.open} />
        <Grid>
          {organizations}
        </Grid>
      </div>
    );
  }
}

Organizations.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Organizations);
