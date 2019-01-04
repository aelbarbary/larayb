import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import firebase from '../../../lib/firebase.js';
import Button from '@material-ui/core/Button'
// import {ApproveOffer} from  '../../../actions/Offer.js'
// import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom'

const firestore = firebase.firestore();

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
  { id: 'cost', numeric: true, disablePadding: false, label: 'Cost' },
  { id: 'city', numeric: false, disablePadding: false, label: 'City' },
  { id: 'state', numeric: false, disablePadding: false, label: 'State' },
  { id: 'datetimeFrom', numeric: false, disablePadding: false, label: 'From' },
  { id: 'approved', numeric: false, disablePadding: false, label: 'Approved' },

];

class TableHeader extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };



  render() {
    const { order, orderBy } = this.props;

    return (
          <TableHead>
            <TableRow>

              {rows.map(row => {
                return (
                  <TableCell
                    key={row.id}
                    align={row.numeric ? 'right' : 'left'}
                    padding='default'
                    sortDirection={orderBy === row.id ? order : false}
                  >
                    <Tooltip
                      title="Sort"
                      placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={this.createSortHandler(row.id)}
                      >
                        {row.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                );
              }, this)}
            </TableRow>
          </TableHead>
    );
  }
}

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

class MyTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    data: [],
    page: 0,
    rowsPerPage: 10,
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

   handleCreateOfferClick(){
     console.log("rerouting");
     this.props.history.push({
         pathname: '/offer'
       })
   }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
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



        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableHeader
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow
                      hover
                      key={n.id}
                    >

                      <TableCell component="th" scope="row" >
                        {n.title}
                      </TableCell>
                      <TableCell align="right">{n.cost}</TableCell>
                      <TableCell align="right">{n.city}</TableCell>
                      <TableCell align="right">{n.state}</TableCell>
                      <TableCell align="right">{n.datetimeFrom.toDate().toLocaleDateString()}</TableCell>
                      <TableCell align="right">{n.approved}</TableCell>

                      <TableCell align="right">
                      <button>
                         <Link style={{display: 'block', height: '100%'}}
                           to={{
                               pathname: `/offer/${n.id}`,
                               state: {
                                       user:  user
                                     }
                             }}
                         >Edit</Link>
                      </button>
                      </TableCell>

                      <TableCell align="right">

                      </TableCell>

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
    </div>
    );
  }
}

MyTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyTable);
