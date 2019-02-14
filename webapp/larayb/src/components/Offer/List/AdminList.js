import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OfferDataTable from './OfferDataTable.js';
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

  render() {
    const { data } = this.state;

    const {user } = this.props;
    return (
      <div>
        <OfferDataTable data={data} user={user}/>
    </div>
    );
  }
}

OfferAdminList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferAdminList);
