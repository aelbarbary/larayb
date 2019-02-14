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
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Avatar from '@material-ui/core/Avatar';
import Root from '../../Root.js';

const styles = theme => ({
  card: {
    padding: 20,
    display: 'flex',
    backgroundColor: '#FAF8F8'
  },
  offersList:{
    margin: 30,

  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    justifyContent: 'center',
    textAlign:'center'
  },
  avatar: {
    textAlign: 'center',
    margin: 'auto',
    width: 60,
    height: 60,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1
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
  switch:{
    marginLeft: 20
  },
  addressLink:{
    color: 'gray',
    fontSize: 12,
    whiteSpace: 'pre-wrap'
  },
  Header:{
    fontSize: 14,
    fontWeight: 'bold'
  }
});

class ProviderDetails extends Component {
  state = { provider: {},  loading: false, offers:[], showPastEvents: false };

  componentWillMount(){
    this.setState({loading: true});
    const {id} = this.props.match.params;
    GetProvider(id, (data) => {
      this.setState({ provider: data}) ;
      GetOffersByProvider(id, (offers) => {
        this.setState({offers: offers, loading: false});
      });
    });

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

  handleShowPastEvents(){
    this.setState({ showPastEvents: !this.state.showPastEvents });
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
            if (this.state.showPastEvents ||  offer.offerType === 'product' ||  offer.datetimeTo.toDate() >= new Date() ){
            items.push(

                  <Grid item zeroMinWidth key={offer.id} >
                    <Reveal effect="fadeInUp" duration={i% 10 * 100}>
                      <OfferCard offer={offer}></OfferCard>
                    </Reveal>
                  </Grid>

            );
          }
        return ""
        });
        data = items
    }

    return (
      <Root>

      <Card className={classes.card} >

        <div className={classes.details} style={{width: '100%', textAlign:'center'}}>
          <CardContent className={classes.content} >
            <div id="avatar-rahmy">
              <Avatar alt="" src={provider.logo}  className={classes.avatar}/>
            </div>
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
          <div className={classes.controls} style={{textAlign: 'center', justifyContent:'center', width: '100%'}}>
            {phone}
            {email}
            {website}
          </div>
        </div>
        <div className={classes.grow} />

        </Card>

        <FormControlLabel
          className={classes.switch}
            control={
              <Switch
                  checked={this.state.showPastEvents}
                  onChange={() => this.handleShowPastEvents()}
                  color="primary"
                />
          }
          label="Show Past Offers"
          />
        <Grid item xs className={classes.offersList}>
          <Typography className={classes.Header}>
            Offers
          </Typography>
          <Grid container spacing={24} justify="center" className={classes.root}>
            {data}
          </Grid>
        </Grid>
      </Root>
    );
  }
}

ProviderDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

export default withStyles(styles, { withTheme: true })(ProviderDetails);
