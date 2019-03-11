import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import {FormatAddressHelper} from "../../../common/CommonFormatMethods.js"
import {RenderOfferDateTime} from "../../../common/CommonRenderMethods.js"
import { Link } from 'react-router-dom'

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  classHeader:{
    textOverflow: 'ellipsis',
    maxWidth: 300
  },
  cardHeader:{
    minHeight: 45
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9

  },
  actions: {
    display: 'flex',
    paddingTop: 5,
    paddingBottom: 5
  },
  content:{
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 5
  },

  address:{
    marginTop: 20
  },
  provider:{
    fontWeight:'bold'
  },
  orgLogo:{
    width: 40
  },
  addressLink:{
    color: 'gray',
    fontSize: 11
  },
 organization:{
   color: 'gray',
   fontSize: 12,
   fontWeight: 'bold'
 },

});

class OfferCardAdmin extends Component {
  state = { expanded: false, imageOpen: false  };

  renderAvatar(offer){
    const { classes } = this.props;
    if (offer.provider !== undefined){
      if (offer.provider.name.toLowerCase() === 'larayb'){
        return <img  className={classes.orgLogo} alt="" />
      } else {
        return ( <a href={offer.provider.website} target="_blank" rel="noopener noreferrer">
                      <img src={offer.provider.logo} alt={offer.provider.name} className={classes.orgLogo} />
                    </a> );
      }
    }
  }

  renderCardContent(offer){
    const { classes } = this.props;
    const address = FormatAddressHelper(offer.address,  offer.city, offer.state, offer.zip);
    const addressLink = "http://maps.google.com/?q=" + address;

    if (offer.provider !== undefined){
      return <div>
              <Typography
                component="p"
                noWrap>
                <a href={`/provider/${offer.provider.id}/details`} className={classes.organization}>
                  {offer.provider.name}
                </a>
              </Typography>
                <Typography component="p" noWrap>
                  <a
                    href={addressLink}
                    className={classes.addressLink}
                    target='_blank'
                    rel="noopener noreferrer">
                    {address}
                  </a>
                </Typography>
              </div>
    }
  }

  render() {
    const { classes } = this.props;
    const { offer } = this.props;
    const content = this.renderCardContent(offer);
    const offerDateTime = RenderOfferDateTime(offer);

    return (
      <Card className={classes.card} >
        <CardHeader
          title= <Link to={`/offer/${offer.id}/details`}>
                  <Typography component="p" noWrap style={{width:250, fontWeight: 'bold'}}>{offer.title}</Typography>
                 </Link>

          subheader= {offerDateTime}
          className={classes.cardHeader}
        />
        <CardMedia
          className={classes.media}
          image={offer.image}
          title={offer.title}
          onClick={() => this.handleImageOpen(offer.image)}
        />
        <CardContent className={classes.content}>
          {content}
        </CardContent>
        <CardActions className={classes.actions} >
          <Typography component="p">
            registrants: {offer.totalRegistrants}
          </Typography>

        </CardActions>
      </Card>
    );
  }
}

OfferCardAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferCardAdmin);
