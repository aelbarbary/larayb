import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import {GetOffer} from  '../../../actions/Offer.js';
import {RenderOfferDateTime, RenderOfferWebsite, RenderOfferPhone, RenderOfferCost, RenderOfferEmail} from "../../../common/CommonRenderMethods.js"
import Root from '../../Root.js';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 50
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    backgroundColor: '#FAF8F8'
  },
  image: {
    width: 300,

  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
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

  render(){
    const { classes } = this.props;
    const {offer} = this.state;
    const phone = RenderOfferPhone(offer);
    const email = RenderOfferEmail(offer);
    const website = RenderOfferWebsite(offer);
    const cost = RenderOfferCost(offer);
    const offerDateTime = RenderOfferDateTime(offer);
    return (
      <Root>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container spacing={16}>
              <Grid item>
                <ButtonBase className={classes.image}>
                  <img className={classes.image} alt="complex" src={offer.image} />
                </ButtonBase>
                <Typography color="textSecondary">
                     {phone}
                     {email}
                     {website}
                 </Typography>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={16}>
                  <Grid item xs>
                    <Typography gutterBottom variant="h4" >
                      {offer.title}
                    </Typography>
                    <Typography gutterBottom>{offer.description}</Typography>
                    <Typography color="textSecondary">{offerDateTime}</Typography>
                  </Grid>
                  {/*<Grid item>
                    <Typography style={{ cursor: 'pointer' }}>Remove</Typography>
                  </Grid>*/}
                </Grid>
                <Grid item>
                  <Typography variant="h6" style={{marginLeft: '30px', color:'blue'}}>{cost}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
                      { offer.registrationURL !== undefined && offer.registrationURL.trim() !== "" &&
                        <Button variant="outlined" size="large" color="primary" className={classes.registerButton} href={offer.registrationURL}>
                          Interested
                        </Button>
                      }
            </Grid>
          </Paper>
        </div>

      </Root>
    );
  }
}

OfferDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferDetails);
