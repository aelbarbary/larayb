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
import {FormatAddressHelper} from "../../../common/CommonFormatMethods.js"
import {RenderOfferWebsite, RenderOfferPhone, RenderOfferDateTime, RenderOfferCost, RenderOfferEmail} from "../../../common/CommonRenderMethods.js"
import Collapse from '@material-ui/core/Collapse';
import classnames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom'
import EmailIcon from '@material-ui/icons/AlternateEmail';
import Linkify from 'react-linkify';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { SocialIcon } from 'react-social-icons';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';

const ITEM_HEIGHT = 48;

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  classHeader:{
    textOverflow: 'ellipsis',
    maxWidth: 300
  },
  cardHeader:{
    minHeight: 60
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
    width: 40,
    maxHeight: 40
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
 organization:{
   color: 'gray',
   fontSize: 12,
   fontWeight: 'bold'
 },
 appBar:{
   color: 'white',
   backgroundColor: '#292c2f'
 }
});

class OfferCardUser extends Component {
  state = { expanded: false, imageOpen: false  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleMoreClick = event => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMoreClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  renderAvatar(offer){
    const { classes } = this.props;
    if (offer.provider !== undefined){
      if (offer.provider.name.toLowerCase() === 'larayb'){
        var providerAcronym = offer.title[0];
        var dummyImg = `https://dummyimage.com/400x400/aaa/000?text=${providerAcronym}`;
        return <img  src={dummyImg} className={classes.orgLogo} alt="" />
      } else {
        return ( <a href={offer.provider.website} target="_blank" rel="noopener noreferrer">
                      <img src={offer.provider.logo} alt={offer.provider.name} className={classes.orgLogo} />
                    </a> );
      }
    }
  }

  renderRegister(offer){
    let regLink ;

    if (offer.useLaraybRegistrationSystem === true){
      regLink = `/register/${offer.id}`;
    } else{
      if ( offer.registrationURL !== undefined && offer.registrationURL.trim() !== "" )
      {
        regLink = offer.registrationURL;
      }
    }

    if (regLink !== undefined){
      return (
        <IconButton aria-label="Register" href={regLink}>
          <PersonAddIcon />
        </IconButton>
      );
    }

    return "";
  }

  renderEmail(offer){
    if (offer !== undefined && offer.email !== undefined && offer.email !== ''){
      const href = 'mailto:' + offer.email;
      return(

      <IconButton aria-label="Email" href={href}>
        <EmailIcon />
      </IconButton>
    );
    } else{
      return ''
    }
  }

  handleImageOpen = (img) => {
    this.setState({ image: img , imageOpen: true });
  };

  handleImageClose = () => {
    this.setState({ imageOpen: false });
  };

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
    const avatar = this.renderAvatar(offer);
    const register = this.renderRegister(offer);
    const phone = RenderOfferPhone (offer);
    const cost = RenderOfferCost(offer);
    const content = this.renderCardContent(offer);
    const offerDateTime = RenderOfferDateTime(offer);
    const email = RenderOfferEmail(offer);
    const website = RenderOfferWebsite(offer);
    const { menuAnchorEl } = this.state;
    const moreMenuOpen = Boolean(menuAnchorEl);
    let moreOptions = [];
    if (offer.provider.facebook !== undefined && offer.provider.facebook !== ''){
      moreOptions.push(offer.provider.facebook);
    }
    if (offer.provider.instagram !== undefined && offer.provider.instagram !== ''){
      moreOptions.push(offer.provider.instagram);
    }
    if (offer.provider.website !== undefined && offer.provider.website !== ''){
      moreOptions.push(offer.provider.website);
    }
    if (offer.viewSettings !== undefined && offer.viewSettings.adminView === true){
      console.log("admin view");
    }

    return (
      <Card className={classes.card} >
        <CardHeader
          avatar={avatar}
          action={
            <div>
             <IconButton
               onClick={this.handleMoreClick}>
               <MoreVertIcon />
             </IconButton>

             <Menu
                id="long-menu"
                anchorEl={menuAnchorEl}
                open={moreMenuOpen}
                onClose={this.handleMoreClose}
                PaperProps={{
                  style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                  },
                }}
              >
                {moreOptions.map(option => (
                  <MenuItem key={option} selected={option === 'Pyxis'} onClick={this.handleClose}>
                    <SocialIcon url={option} style={{width: 20, height: 20}}/>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          }
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
        <CardActions className={classes.actions} disableActionSpacing>
          {register}
          {phone}
          {email}
          {website}
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
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit >
          <CardContent>
            <Typography paragraph style={{fontWeight:'bold'}}>{offer.title}</Typography>
            <Typography paragraph style={{whiteSpace: 'pre-wrap'}}>
              <Linkify>
                {offer.description}
              </Linkify>
            </Typography>

          </CardContent>
        </Collapse>


        <Dialog
          open={this.state.imageOpen}
          onClose={this.handleImageClose}
          TransitionComponent={Transition}
        >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleImageClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Offer Image
            </Typography>
          </Toolbar>
        </AppBar>
          <img src={this.state.image} alt=""  style={{ width: '100%', objectFit:'fill'}}/>
        </Dialog>

      </Card>
    );
  }
}

OfferCardUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferCardUser);
