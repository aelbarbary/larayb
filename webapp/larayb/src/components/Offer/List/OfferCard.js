import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PhoneIcon from '@material-ui/icons/Phone';
import moment from 'moment';
import FormatAddressHelper from "../../../common/index.js"
import Collapse from '@material-ui/core/Collapse';
import classnames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  card: {
    maxWidth: 400,
    minWidth: 400,
  },
  classHeader:{
    textOverflow: 'ellipsis',
    maxWidth: 300
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
  cost:{
    marginLeft: 'auto',
    marginRight: 10,
    color: 'gray',
    fontWeight: 'bold'
  },
  avatar: {
    backgroundColor: red[500],
  },
  address:{
    marginTop: 20
  },
  organization:{
    fontWeight:'bold'
  },
  orgLogo:{
    width: 40
  },
  addressLink:{
    color: 'gray',
    fontSize: 11
  }
});

class OfferCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  formatOfferDate(datetimeFrom, datetimeTo){
    if (datetimeTo === undefined || datetimeFrom.toDate().getTime() === datetimeTo.toDate().getTime() ){
      const datetimeFromTimestamp = datetimeFrom.toDate();
      const formattedDate = moment(datetimeFromTimestamp).format("lll");
      return formattedDate
    } else{
      const datetimeFromTimestamp = datetimeFrom.toDate();
      const datetimeToTimestamp = datetimeTo.toDate();
      const formattedDate = moment(datetimeFromTimestamp).format("ll") + " to " + moment(datetimeToTimestamp).format("ll");
      return formattedDate
    }
  }

  renderAvatar(offer){
    const { classes } = this.props;
    if (offer.organizationName){
      return (
      <a href={offer.organizationWebsite} target="_blank" rel="noopener noreferrer">
        <img src={offer.organizationLogo} alt={offer.organizationName} className={classes.orgLogo} />
      </a>);
    } else{
      return (
      <a href={offer.individualWebsite} target="_blank" rel="noopener noreferrer">
        <img src={offer.individualImageURL} alt={offer.individualName} className={classes.orgLogo} />
      </a>);
    }
  }

  renderPhone(offer){
    console.log(offer.phone);
    if (offer.phone !== undefined && offer.phone !== ''){
      const href = 'tel:' + offer.phone
      return(

      <IconButton aria-label="Register" href={href}>
        <PhoneIcon />
      </IconButton>
    );
    } else{
      return <IconButton/>
    }
  }



  render() {
    const { classes } = this.props;
    const { offer } = this.props;

    const offerDate = this.formatOfferDate(offer.datetimeFrom, offer.datetimeTo);
    const avatar = this.renderAvatar(offer);
    const phone = this.renderPhone(offer);
    const address = FormatAddressHelper(offer.address,  offer.city, offer.state, offer.zip);
    const addressLink = "http://maps.google.com/?q=" + FormatAddressHelper(offer.address,  offer.city, offer.state, offer.zip);
    return (
      <Card className={classes.card} >
        <CardHeader
          avatar={avatar}
          title=<Typography component="p" noWrap style={{width:300, fontWeight: 'bold'}}>{offer.title}</Typography>
          subheader= {offerDate}
          className={classes.cardHeader}
        />
        <CardMedia
          className={classes.media}
          image={offer.image}
          title="Paella dish"
        />
      <CardContent className={classes.content}>
          {/* <Typography component="p" noWrap>
             {event.description}
           </Typography> */}
          <Typography component="p" noWrap className={classes.organization}>
            {offer.organizationName} {offer.individualName}
          </Typography>
          <Typography component="p" noWrap>
            <a href={addressLink} className={classes.addressLink} target='_blank' rel="noopener noreferrer">{address}</a>
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {/* <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton> */}
          <IconButton aria-label="Register" href={offer.registrationURL}>
            <PersonAddIcon />
          </IconButton>

          {phone}

          <Typography className={classes.cost}>
            ${offer.cost}
          </Typography>

          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>


        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph style={{fontWeight:'bold'}}>{offer.title}</Typography>
            <Typography paragraph>
              {offer.description}
            </Typography>

          </CardContent>
        </Collapse>

      </Card>
    );
  }
}

OfferCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferCard);
