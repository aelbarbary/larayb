import React from "react";
import { Link } from 'react-router-dom'
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import {DeleteProvider} from  '../../../actions/Provider.js'

export class ProviderDataTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data : []
    };
  }

  componentWillMount(){
    const {data} = this.props;
    this.setState({data: data});
  }

  componentWillReceiveProps(nextProps){
    const {data} = nextProps;
    this.setState({data: data});
  }

  deleteProvider(id){
      DeleteProvider(id);
      this.setState({ data : this.state.data.filter( d => d.id !== id) });
  }

  render() {
    const { user } = this.props;
    return (
      <div>
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
                  accessor: "id",
                  Cell: row => (
                    <button>
                        <Link style={{display: 'block', height: '100%'}}
                          to={{
                              pathname: `/provider/${row.value}`,
                              state: {
                                      user:  user
                                    }
                            }}
                        >Edit</Link>
                     </button>
                  )
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
                    <button onClick={() => this.deleteProvider(row.value)}>
                      Delete
                     </button>
                  )
                }
              ]
            }

          ]
          }
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />

      </div>
    );
  }
}
