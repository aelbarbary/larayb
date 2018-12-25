import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import firebase from '../../../lib/firebase.js';
import OrganizationForm from '../Form/index';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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
    marginTop: 10,
  },
  logo: {
    width:40
  },
});

class OrganizationList extends React.Component {
  state = {open: false, organizations:[]};

  constructor(props){
    super(props);
    this.getOrganizations = this.getOrganizations.bind(this);
  }

  handleClickOpen = () => {
    this.setState({ open: true, anchorEl: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
    window.location.reload();
  };

  componentWillMount(){
    const {user} = this.props;
    this.getOrganizations(user.userId);
  }

  getOrganizations(userId){
    var organizations = [];
    firestore.collection("organizations")
    .where("userId", "==", userId)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            organizations.push({ id: doc.id, ...doc.data()});
        });
    })
    .then(()=>{
      this.setState({
             organizations: organizations,
             open: false
          });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  handleMenuClick = event => {
    console.log(event);
    this.setState({ anchorEl: event.currentTarget });
  };


  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  deleteOrg(id){
    const { user } = this.props;
    console.log(id);
    firestore.collection("organizations").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        this.getOrganizations(user.userId);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }

  render() {
    const { classes, user } = this.props;

    const organizations = this.state.organizations.map((org, i) =>
            <Grid item zeroMinWidth key={org.name}>
              <Card className={classes.card}>
                  <CardHeader
                    avatar={
                      <img aria-label="Recipe" className={classes.logo} src={org.logo} alt={org.name}>
                      </img>
                    }
                    action={
                      <IconButton onClick={() => this.deleteOrg(org.id)}>
                        <DeleteIcon />
                      </IconButton>
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
        <OrganizationForm user={user} open={this.state.open}  getOrganizations={() => this.getOrganizations(user.userId)}/>
        <Grid>
          {organizations}
        </Grid>
      </div>
    );
  }
}

OrganizationList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrganizationList);
