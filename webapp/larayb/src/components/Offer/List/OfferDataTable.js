import React from "react";
import { Link } from 'react-router-dom'
// Import React Table
import moment from 'moment';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {DeleteOffer} from  '../../../actions/Offer.js'
export class OfferDataTable extends React.Component {
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

  deleteOffer(id){
      DeleteOffer(id);
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
              Header: "Title",
              columns: [
                {
                  Header: "",
                  accessor: "title",
                  filterMethod: (filter, row) =>
                    row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                }
              ]
            },
            {
              Header: "Provider",
              columns: [
                {
                  Header: "",
                  accessor: "provider.name",
                  filterMethod: (filter, row) =>
                    row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                }
              ]
            },
            {
              Header: "Cost",
              columns: [
                {
                  accessor: "cost",
                  filterMethod: (filter, row) =>
                    row[filter.id] === filter.value
                }
              ]
            },
            {
              Header: "From",
              columns: [
                {
                  accessor: "datetimeFrom",
                  Cell: row => (
                    <span>{moment(row.value.toDate()).format("MMM, DD YYYY")}</span>
                  )
                }
              ]
            },
            {
              Header: "To",
              columns: [
                {
                  accessor: "datetimeTo",
                  Cell: row => (
                    <span>{moment(row.value.toDate()).format("MMM, DD YYYY")}</span>
                  )
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
                              pathname: `/offer/${row.value}`,
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
                    <button onClick={() => this.deleteOffer(row.value)}>
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
