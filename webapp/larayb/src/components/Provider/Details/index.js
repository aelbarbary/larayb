import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {GetProvider} from  '../../../actions/Provider.js';
import {GetOffersByProvider} from  '../../../actions/Offer.js';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import WebIcon from '@material-ui/icons/Language';
import {FormatAddressHelper} from "../../../common/CommonFormatMethods.js"
import loading from '../../../assets/images/loading.gif';
import Reveal from 'react-reveal/Reveal';
import OfferCard from '../../Offer/List/OfferCard.js';

const styles = theme => ({
  card: {
    margin: 30,
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 140,

    padding: 10
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  grow: {
    flexGrow: 1,
  },
});

class ProviderDetails extends Component {
  state = { provider: {},  loading: false, offers:[] };

  componentWillMount(){
    this.setState({loading: true});
    const {id} = this.props.match.params;
    GetProvider(id, (data) => {
      console.log("hello");
      this.setState({ provider: data}) ;
      GetOffersByProvider(id, (offers) => {
        this.setState({offers: offers, loading: false});
      });
    });

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

  renderWebsite = (provider) => {
    let href = '';

    if (provider.website !== undefined && provider.website !== ''){
          href = provider.website;
      } else if (provider.facebook !== undefined && provider.facebook !== ''){
          href = provider.facebook;
      }


    if (href !== ''){
      return(
        <IconButton aria-label="Email" href={href}>
          <WebIcon />
        </IconButton>
      );

    }

    return ''
  }

  renderPhone = (provider) => {

    if (provider.phone !== undefined && provider.phone !== ''){
      const href = 'tel:' + provider.phone
      return(

      <IconButton aria-label="Register" href={href}>
        <PhoneIcon />
      </IconButton>
    );
    } else{
      return ""
    }
  }


  renderEmail = (provider) => {
    if (provider !== undefined && provider.email !== undefined && provider.email !== ''){
      const href = 'mailto:' + provider.email;
      return(

      <IconButton aria-label="Email" href={href}>
        <EmailIcon />
      </IconButton>
    );
    } else{
      return ''
    }
  }

  render(){
    const { classes } = this.props;
    const {provider} = this.state;

    const phone = this.renderPhone (provider);
    const email = this.renderEmail(provider);
    const website = this.renderWebsite(provider);
    const address = FormatAddressHelper(provider.address,  provider.city, provider.state, provider.zip);
    const addressLink = "http://maps.google.com/?q=" + address
    let data;

    if (this.state.loading) {
      data = <img src={loading} alt="loading" />
    } else {
        var items = [];
        this.state.offers.map((offer, i) => {

            items.push(

                  <Grid item zeroMinWidth key={offer.id} >
                    <Reveal effect="fadeInUp" duration={i% 10 * 100}>
                      <OfferCard offer={offer}></OfferCard>
                    </Reveal>
                  </Grid>

            );
            return ""
        });
        data = items
    }

    return (
      <div>

      <Card className={classes.card}>
      <div className={classes.cover}>
      <img
        src={provider.logo}
        alt={provider.name}
        className={classes.cover}
        />
        </div>
        <div className={classes.details}>
          <CardContent className={classes.content}>

            <Typography component="h5" variant="h5">
              {provider.name}
            </Typography>
            <Typography component="h8" variant="h8">
              {provider.description}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              <a
                href={addressLink}
                className={classes.addressLink}
                target='_blank'
                rel="noopener noreferrer">
                {address}
              </a>
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            {phone}
            {email}
            {website}
          </div>
        </div>
        <div className={classes.grow} />

        </Card>
        <Grid container spacing={24} justify="center" className={classes.root}>
          {data}
        </Grid>

      </div>
    );
  }
}

ProviderDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

export default withStyles(styles, { withTheme: true })(ProviderDetails);
