import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import {ProviderDataTable} from "./ProviderDataTable.js"
import {GetProviders} from  '../../../actions/Provider.js'
import { Link } from 'react-router-dom'

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
    const {user} = this.props;
    var providers = [];
    GetProviders()
    .where("userId", "==", user.userId)
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
    this.setState({ anchorEl: event.currentTarget });
  };


  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { user } = this.props;
    const {providers} = this.state;

    return (
      <div>
        <Button variant="outlined" color="primary" component={Link} to={{
            pathname: `/provider/`,
            state: {
                    user: user
                  }
          }}>
          Create a New Provier
        </Button>

        <Grid>
          <ProviderDataTable data ={providers} />
        </Grid>
      </div>
    );
  }
}

ProviderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProviderList);
