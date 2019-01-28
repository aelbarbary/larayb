import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {OfferDataTable} from './OfferDataTable.js';
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import {GetOffersByUserId} from  '../../../actions/Offer.js';

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

  componentWillMount() {
       this.search();
   }

   search(){
       const {user } = this.props;

       GetOffersByUserId(user.userId, (offers) =>{
         this.setState({
                data: offers,
                loading: false
             });
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
