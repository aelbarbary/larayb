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

import FormatAddressHelper, {FormatOfferDate, FormatOfferTime} from "../../../common/index.js"
import Collapse from '@material-ui/core/Collapse';
import classnames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),

    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
   transform: 'rotate(180deg)',
 },
});

class OfferCard extends Component {
  state = { expanded: false,  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };


  renderAvatar(offer){
    const { classes } = this.props;
    if (offer.provider !== undefined){
      return ( <a href={offer.provider.website} target="_blank" rel="noopener noreferrer">
                    <img src={offer.provider.logo} alt={offer.provider.name} className={classes.orgLogo} />
                  </a> );
    }
  }

  renderPhone(offer){
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

  renderOfferDateTime(offer){
    if (offer.offerType === 'activity' || offer.offerType === undefined ){ // default is activity
        var date = FormatOfferDate(offer.datetimeFrom.toDate(), offer.datetimeTo.toDate()) ;
        var time = FormatOfferTime(offer.datetimeFrom.toDate(), offer.datetimeTo.toDate());
        return <div>
                  <Typography color="textSecondary">
                    {date}
                  </Typography>
                  <Typography color="textSecondary">
                    {time}
                  </Typography>
              </div>
    } else {
      return ""   // product has no dates
    }
  }

  renderCost(offer){
    if (offer.cost !== 0){
      return `$${offer.cost}`;
    }
    if (offer.offerType === "product"){
        return "Call us";
    } else if (offer.offerType === "activity"){
        return "Free";
    }
  }

  renderCardContent(offer){
    const { classes } = this.props;
    const addressLink = "http://maps.google.com/?q=" + FormatAddressHelper(offer.address,  offer.city, offer.state, offer.zip);
    const address = FormatAddressHelper(offer.address,  offer.city, offer.state, offer.zip);

    if (offer.provider !== undefined){
      return <div>
                <Typography
                  component="p"
                  noWrap
                  className={classes.organization}>
                  {offer.provider.name}
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
    const avatar = this.renderAvatar(offer);
    const phone = this.renderPhone(offer);
    const cost = this.renderCost(offer);
    const content = this.renderCardContent(offer);
    const offerDateTime = this.renderOfferDateTime(offer);

    return (
      <Card className={classes.card} >
        <CardHeader
          avatar={avatar}
          title= <Link to={`/offer/${offer.id}/details`}>
                  <Typography component="p" noWrap style={{width:300, fontWeight: 'bold'}}>{offer.title}</Typography>
                 </Link>
          subheader= {offerDateTime}
          className={classes.cardHeader}
        />
        <CardMedia
          className={classes.media}
          image={offer.image}
          title="Paella dish"
        />
        <CardContent className={classes.content}>
          {content}
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {/* <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton> */}
          { offer.registrationURL.trim() !== "" &&
            <IconButton aria-label="Register" href={offer.registrationURL}>
              <PersonAddIcon />
            </IconButton>
          }
          {phone}

          <Typography className={classes.cost}>
            {cost}
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
