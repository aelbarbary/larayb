import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import {GetOffer} from  '../../../actions/Offer.js';
import Button from '@material-ui/core/Button';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import WebIcon from '@material-ui/icons/Language';
import IconButton from '@material-ui/core/IconButton';
import {RenderOfferDateTime} from "../../../common/CommonRenderMethods.js"

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    // maxWidth: 800
  },
  offerImage: {
    width: 400,
    // height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  orgLogo:{
    width: 40
  },
  registerButton:{
    width: 400,
    marginTop: 20,
    backgroundColor: '#3CBC8D',
    color: 'black'
  }
});

class OfferDetails extends Component {
  state = { offer: {} };

  componentWillMount(){
    const {id} = this.props.match.params;
    GetOffer(id, (data) => { this.setState({ offer: data}) });
  }

  renderAvatar(offer){
    const { classes } = this.props;
    if (offer.provider !== undefined){
      return (    <a href={offer.provider.website} target="_blank" rel="noopener noreferrer">
                    <img src={offer.provider.logo} alt={offer.provider.name} className={classes.orgLogo} />
                    <Typography gutterBottom  style={{fontWeight: 'bold'}}>
                      {offer.provider.name}
                    </Typography>

                  </a> );
    }
  }

  renderPhone(offer){
    if (offer.phone !== undefined && offer.provider.phone !== ''){
      const href = 'tel:' + offer.phone
      return(

      <IconButton aria-label="Register" href={href}>
        <PhoneIcon />
      </IconButton>
    );
    } else{
      return ''
    }
  }

  renderEmail(offer){
    if (offer.provider !== undefined && offer.provider.email !== undefined && offer.provider.email !== ''){
      const href = 'mailto:' + offer.provider.email;
      return(

      <IconButton aria-label="Email" href={href}>
        <EmailIcon />
      </IconButton>
    );
    } else{
      return ''
    }
  }

  renderWebsite(offer){
    let href = '';
    if (offer.registrationURL !== ''){
      href  = offer.registrationURL;
    } else if (offer.provider !== undefined ) {
      if (offer.provider.website !== undefined && offer.provider.email !== ''){
          href = offer.provider.website;
      } else if (offer.provider.facebook !== undefined && offer.provider.facebook !== ''){
          href = offer.provider.facebook;
      }

      if (href !== ''){
        return(
          <IconButton aria-label="Email" href={href}>
            <WebIcon />
          </IconButton>
        );

      }
    }

    return ''

  }

  renderCost(offer){
    if (offer.cost !== undefined && offer.cost !== 0){
      return `$${offer.cost}`;
    }
    if (offer.offerType === "product"){
        return "Call us";
    } else if (offer.offerType === "activity"){
        return "Free";
    }
  }

  render(){
    const { classes } = this.props;
    const {offer} = this.state;
    const avatar = this.renderAvatar(offer);
    const phone = this.renderPhone(offer);
    const email = this.renderEmail(offer);
    const website = this.renderWebsite(offer);
    const cost = this.renderCost(offer);
    const offerDateTime = RenderOfferDateTime(offer);
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>

          <Grid container spacing={16}>
            <Grid item xs={16}>
              {avatar}
            </Grid>
            <Grid>
                <Grid item xs={8}>
                  <ButtonBase className={classes.image}>
                    <img alt="" src={offer.image} className={classes.offerImage}/>
                  </ButtonBase>
                </Grid>
                <Grid item xs={8}>
                  { offer.registrationURL !== undefined && offer.registrationURL.trim() !== "" &&
                    <Button variant="outlined" size="large" color="primary" className={classes.registerButton} href={offer.registrationURL}>
                      Register
                    </Button>
                  }
                </Grid>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={16}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1" style={{ fontWeight: 'bold', fontSize: 18}}>
                    {offer.title}
                  </Typography>
                  <Typography gutterBottom   noWrap style={{ fontWeight: 'bold'}}>
                    {offerDateTime}
                  </Typography>
                  <Typography gutterBottom   noWrap style={{ fontWeight: 'bold'}}>
                    {cost}
                  </Typography>
                  <Typography color="textSecondary">
                      {phone}
                      {email}
                      {website}
                  </Typography>
                  <Typography gutterBottom style={{whiteSpace: 'pre-wrap'}}>{offer.description}</Typography>

                </Grid>

              </Grid>

            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

OfferDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferDetails);
