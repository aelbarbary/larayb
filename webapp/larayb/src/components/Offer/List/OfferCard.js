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
import moment from 'moment';

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
  cost: {
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
  }
});

class OfferCard extends Component {
  state = { expanded: false };

  formatEventDate(datetimeFrom, datetimeTo){
    if (datetimeTo === undefined || datetimeFrom.toDate().getTime() === datetimeTo.toDate().getTime() ){
      const eventTimestamp = datetimeFrom.toDate();
      const formattedDate = moment(eventTimestamp).format("lll");
      return formattedDate
    } else{
      const eventFrom = datetimeFrom.toDate();
      const eventTo = datetimeTo.toDate();
      const formattedDate = moment(eventFrom).format("ll") + " to " + moment(eventTo).format("ll");
      return formattedDate
    }
  }

  formatAddress(address, city, state, zip){
    var formattedAddress = "";
    if (address){
      formattedAddress += address + ", ";
    }
    if (city){
      formattedAddress += city + ", "
    }
    if (state){
      formattedAddress += state + " "
    }
    if (zip){
      formattedAddress += zip
    }

    return formattedAddress;
  }

  render() {
    const { classes } = this.props;
    const { event } = this.props;
    console.log(event);
    const eventDate = this.formatEventDate(event.datetimeFrom, event.datetimeTo);
    return (
      <Card className={classes.card} >
        <CardHeader
          avatar={
            <a href={event.organizationWebsite} target="_blank" rel="noopener noreferrer">
              <img src={event.organizationLogo} alt={event.organizationName} className={classes.orgLogo} />
            </a>
          }
          title={event.title}
          subheader= {eventDate}
          className={classes.cardHeader}
        />
        <CardMedia
          className={classes.media}
          image={event.image}
          title="Paella dish"
        />
      <CardContent className={classes.content}>
          {/* <Typography component="p" noWrap>
             {event.description}
           </Typography> */}
          <Typography component="p" noWrap className={classes.organization}>
            {event.organizationName}
          </Typography>
          <Typography component="p" noWrap>
            {this.formatAddress(event.address,  event.city, event.state, event.zip)}

          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {/* <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton> */}
          <IconButton aria-label="Register" href={event.registrationURL}>
            <PersonAddIcon />
          </IconButton>

          <Typography className={classes.cost}>
            ${event.cost}
          </Typography>


        </CardActions>

      </Card>
    );
  }
}

OfferCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferCard);
