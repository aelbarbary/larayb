import React from "react";
import moment from 'moment';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {DeleteOffer} from  '../../../actions/Offer.js'
import { withStyles } from '@material-ui/core/styles';
import {GetSettings}  from  '../../../actions/Settings.js'
import {GetOffer} from  '../../../actions/Offer.js';
import Button from '@material-ui/core/Button';
import OfferForm from '../Form';
import {GetOffersByUserId} from  '../../../actions/Offer.js';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  actionButton:{
    padding: theme.spacing.unit,
    margin: theme.spacing.unit,
  }
});

class OfferDataTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data : [],
      showOfferForm: false
    };
  }

  componentWillMount(){
    const {user} = this.props;
    GetSettings(user.userId, (settings) => {
      this.setState({ settings: settings });
    });

    this.search();
  }

  deleteOffer(id){
      DeleteOffer(id);
      this.setState({ data : this.state.data.filter( d => d.id !== id) });
  }

  handleCreateOfferClick(){
    this.setState({showOfferForm: true, offerId: undefined});
  }

  handleBackClick(){
    this.setState({showOfferForm: false, offerId: undefined});
    this.search();
  }

  handleEditOfferClick(offerId){
    this.setState({showOfferForm: true, offerId: offerId});
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
      })();

    });
  }

  search(){
      const {user } = this.props;
      GetOffersByUserId(user.userId, {adminView: false}, (offers) =>{
        this.setState({
               data: offers,
               loading: false
            });
      });
  }

  hideOfferForm(){
    this.search();
    this.setState({showOfferForm: false});
  }

  render() {
    const { user, classes} = this.props;

    const OffersTable = () => (<ReactTable
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
              Cell: row => (
                <span>${row.value}</span>
              ),
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
          Header: "Address",
          columns: [
            {
              Header: "",
              accessor: "address",

            }
          ]
        },
        // {
        //   Header: "Publish",
        //   columns: [
        //     {
        //       Header: "",
        //       accessor: "id",
        //       filterable: false,
        //       Cell: row => (
        //         <Fab size="small"  aria-label="Add" onClick={ () => this.publishFacebook(row.value)} >
        //           <FacebookIcon size={32} round={true} style={{display: 'inline'}}/>
        //         </Fab>
        //
        //       )
        //     }
        //   ]
        // },
        {
          Header: "",

          columns: [
            {
              accessor: "id",
              filterable: false,
              Cell: row => (
                <div>
                  <Button variant="contained" onClick={ () => this.handleEditOfferClick(row.value)} className={classes.actionButton}>
                      Edit
                   </Button>
                   <Button variant="contained" onClick={() => this.deleteOffer(row.value)} className={classes.actionButton} >
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
    />);

    return (
      <div>

        { !this.state.showOfferForm ? <Button variant="outlined" color="primary" onClick={() => this.handleCreateOfferClick()} >
          Create New Offer
        </Button> : '' }

        { this.state.showOfferForm ? <Button variant="outlined" color="primary" onClick={() => this.handleBackClick()} >
          Back
        </Button> : ''}

        { this.state.showOfferForm ?  <OfferForm user={user} offerId={this.state.offerId} goBack={() => this.hideOfferForm() }/> : ''}
        { this.state.showOfferForm === false ?  <OffersTable/> : ''}
      </div>
    );
  }
}

export default withStyles(styles)(OfferDataTable);
