import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {DeleteProvider} from  '../../../actions/Provider.js'
import ProviderForm from '../Form';
import Button from '@material-ui/core/Button';
import {GetProviders} from  '../../../actions/Provider.js'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  actionButton:{
    padding: theme.spacing.unit,
    margin: theme.spacing.unit,
  }
});

class ProviderDataTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data : [],
      showForm: false
    };
  }

  componentWillMount(){
    this.search();
  }

  componentWillReceiveProps(nextProps){
    this.search();
  }

  handleCreateProviderClick(){
    this.setState({showForm: true, providerId: undefined});
  }

  handleEditProviderClick(providerId){
    this.setState({showForm: true, providerId: providerId});
  }

  handleBackClick(){
    this.setState({showForm: false, providerId: undefined});
    this.search();
  }

  deleteProvider(id){
      DeleteProvider(id);
      this.setState({ data : this.state.data.filter( d => d.id !== id) });
  }

  hideProviderForm(){
    this.search();
    this.setState({showForm: false});
  }

  search(){
      const {user } = this.props;
      GetProviders(user.userId, (providers) =>{
        this.setState({
               data: providers,
               loading: false
            });
      });
  }

  render() {
    const { user, classes } = this.props;
    const ProviderTable = () => (
      <ReactTable
        data={this.state.data}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value}
        columns={[
          {
            Header: "Name",
            columns: [
              {
                Header: "",
                accessor: "name",
                filterMethod: (filter, row) =>
                  row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
              }
            ]
          },
          {
            Header: "City",
            columns: [
              {
                Header: "",
                accessor: "city",
                filterMethod: (filter, row) =>
                  row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
              }
            ]
          },
          {
            Header: "State",
            columns: [
              {
                accessor: "state",
                filterMethod: (filter, row) =>
                  row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
              }
            ]
          },
          {
            Header: "Phone",
            columns: [
              {
                accessor: "phone",
                filterMethod: (filter, row) =>
                  row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
              }
            ]
          },
          {
            Header: "Email",
            columns: [
              {
                accessor: "email",
                filterMethod: (filter, row) =>
                  row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
              }
            ]
          },
          {
            Header: "Website",
            columns: [
              {
                accessor: "website",
                filterMethod: (filter, row) =>
                  row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
              }
            ]
          },
          {
            Header: "",
            columns: [
              {
                Header: "",
                accessor: "id",
                Cell: row => (
                  <div>
                    <Button variant="contained" onClick={ () => this.handleEditProviderClick(row.value)} className={classes.actionButton}>
                        Edit
                    </Button>
                    <Button variant="contained" onClick={() => this.deleteProvider(row.value)} className={classes.actionButton}>
                      Delete
                     </Button>
                  </div>
                )
              }
            ]
          }

        ]
        }
        defaultPageSize={10}
        className="-striped -highlight"
      />
    );

    return (
      <div>
        { !this.state.showForm ? <Button variant="outlined" color="primary" onClick={() => this.handleCreateProviderClick()} >
          Create New Provider
        </Button> : '' }

        { this.state.showForm ? <Button variant="outlined" color="primary" onClick={() => this.handleBackClick()} >
          Back
        </Button> : ''}

        { this.state.showForm ?  <ProviderForm user={user} providerId={this.state.providerId} goBack={() => this.hideProviderForm() }/> : ''}
        { this.state.showForm === false ?  <ProviderTable/> : ''}

        <br />

      </div>
    );
  }
}

export default withStyles(styles)(ProviderDataTable);
