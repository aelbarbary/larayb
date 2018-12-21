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

class Event extends Component {
  state = { expanded: false };

  render() {
    const { classes } = this.props;
    const { event } = this.props;
    const eventTimestamp = event.datetime.toDate();
    const formattedDate = moment(eventTimestamp).format("lll");
    return (
      <Card className={classes.card} >
        <CardHeader
          avatar={
            <img src={event.organizationLogo} alt={event.organizationName} className={classes.orgLogo}/>
          }
          title={event.title}
          subheader= {formattedDate}
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
            {event.address + ", " + event.city + ", " +event.state + " " + event.zip }
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

Event.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Event);
