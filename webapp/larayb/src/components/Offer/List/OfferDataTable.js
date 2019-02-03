import React from "react";
import { Link } from 'react-router-dom'
import moment from 'moment';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {DeleteOffer} from  '../../../actions/Offer.js'
import Fab from '@material-ui/core/Fab';
import {FacebookIcon} from 'react-share';
import { withStyles } from '@material-ui/core/styles';
import {GetSettings}  from  '../../../actions/Settings.js'
import {GetOffer} from  '../../../actions/Offer.js';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class OfferDataTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data : []
    };
  }

  componentWillMount(){
    const {data, user} = this.props;
    this.setState({data: data});

    GetSettings(user.userId, (settings) => {
      this.setState({ settings: settings });
    });
  }

  componentWillReceiveProps(nextProps){
    const {data} = nextProps;
    this.setState({data: data});
  }

  deleteOffer(id){
      DeleteOffer(id);
      this.setState({ data : this.state.data.filter( d => d.id !== id) });
  }

  publishFacebook(id){
    const { user} = this.props;
    const {settings} = this.state;
    GetOffer(id, (offer) => {

      (async () => {
        let access_token = user.accessToken;

        let rawResponse = await fetch(`https://graph.facebook.com/v3.2/${settings.facebookPage}?fields=access_token&access_token=${access_token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        let content = await rawResponse.json();
        let page_access_token = content.access_token;

        rawResponse = await fetch(`https://graph.facebook.com/v3.2/${settings.facebookPage}/feed?message=${offer.title}&access_token=${page_access_token}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        content = await rawResponse.json();

        console.log(content);
      })();

    });
  }

  render() {
    const { user} = this.props;
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
              Header: "Website",
              columns: [
                {
                  Header: "",
                  accessor: "website",
                }
              ]
            },
            {
              Header: "Facebook",
              columns: [
                {
                  Header: "",
                  accessor: "facebook",

                }
              ]
            },
            {
              Header: "Publish",
              columns: [
                {
                  Header: "",
                  accessor: "id",
                  Cell: row => (
                    <Fab size="small"  aria-label="Add" onClick={ () => this.publishFacebook(row.value)} >
                      <FacebookIcon size={32} round={true} style={{display: 'inline'}}/>
                    </Fab>

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
            },


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

export default withStyles(styles)(OfferDataTable);
