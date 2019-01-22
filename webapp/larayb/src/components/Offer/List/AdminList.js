import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../../../lib/firebase.js';
import {OfferDataTable} from './OfferDataTable.js';
import Button from '@material-ui/core/Button'
// import {ApproveOffer} from  '../../../actions/Offer.js'
// import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom'

const firestore = firebase.firestore();

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class OfferAdminList extends React.Component {
  state = {
    data: [],
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  // handleClickApprove(id){
  //   ApproveOffer(id);
  // }

  componentWillMount() {
       this.search();
   }

   search(){
       var offers = [];
       const {user } = this.props;
       firestore.collection("offers")
       .where("userId", "==", user.userId)
       .get()
       .then((querySnapshot) => {
           querySnapshot.forEach((doc) => {
               offers.push({ id: doc.id, ...doc.data()});
           });
       })
       .then(()=>{
         this.setState({
                data: offers,
                loading: false
             });
       })
       .catch(function(error) {
           console.log("Error getting documents: ", error);
       });
   }

   handleCreateOfferClick(event){
     event.preventDefault();
     this.props.history.push({
         pathname: '/offer'
       })
   }

  render() {
    const { data } = this.state;

    const {user } = this.props;
    return (
      <div>

        <Button variant="outlined" color="primary" component={Link} to={{
            pathname: `/offer/`,
            state: {
                    user: user
                  }
          }}>
          Create a New Offer
        </Button>


        <OfferDataTable data={data} user={user}/>
    </div>
    );
  }
}

OfferAdminList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferAdminList);
