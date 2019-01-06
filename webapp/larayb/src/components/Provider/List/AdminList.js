import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import firebase from '../../../lib/firebase.js';
import ProviderForm from '../Form/index';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormatAddressHelper from "../../../common/index.js"

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

class ProviderList extends React.Component {
  state = {open: false, providers:[]};

  constructor(props){
    super(props);
    this.getProviders = this.getProviders.bind(this);
  }

  handleClickOpen = (event) => {
    event.preventDefault();
    this.setState({ open: true, anchorEl: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
    window.location.reload();
  };

  componentWillMount(){
    const {user} = this.props;
    this.getProviders(user.userId);
  }

  getProviders(userId){
    var providers = [];
    firestore.collection("provider")
    .where("userId", "==", userId)
    .orderBy("name")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            providers.push({ id: doc.id, ...doc.data()});
        });
    })
    .then(()=>{
      this.setState({
             providers: providers,
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

  deleteProvider(id){
    const { user } = this.props;
    console.log(id);
    firestore.collection("provider").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
        this.getProviders(user.userId);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }

  render() {
    const { classes, user } = this.props;

    const providers = this.state.providers.map((provider, i) => {
            const address = FormatAddressHelper(provider.address,  provider.city, provider.state, provider.zip);

            return(<Grid item zeroMinWidth key={provider.name}>
              <Card className={classes.card}>
                  <CardHeader
                    avatar={
                      <img aria-label="Recipe" className={classes.logo} src={provider.logo} alt={provider.name}>
                      </img>
                    }
                    action={
                      <IconButton onClick={() => this.deleteProvider(provider.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    title={provider.name}
                    subheader={address}
                  />

                  <CardContent>
                    <Typography component="p">
                      {provider.description}
                    </Typography>
                  </CardContent>

              </Card>
            </Grid>);
          }
      );

    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Create a New Provider
        </Button>
        <ProviderForm user={user} open={this.state.open}  getProviders={() => this.getProviders(user.userId)}/>
        <Grid>
          {providers}
        </Grid>
      </div>
    );
  }
}

ProviderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProviderList);
