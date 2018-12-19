import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
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
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class Event extends Component {
  state = { expanded: false };

  render() {
    const { classes } = this.props;
    const { event } = this.props;

    const eventTimestamp = Date(event.datetime);
    const formattedDate = moment(eventTimestamp).format("lll");
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          title={event.title}
          subheader= {formattedDate}
        />
        <CardMedia
          className={classes.media}
          image={event.image}
          title="Paella dish"
        />
        <CardContent>
          <Typography component="p" noWrap>
            {event.description}
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

        </CardActions>

      </Card>
    );
  }
}

Event.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Event);
