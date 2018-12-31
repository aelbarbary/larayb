import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import {GetOffer} from  '../../../actions/Offer.js';
import Button from '@material-ui/core/Button';


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
    console.log(offer);
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
    const avatar = this.renderAvatar(offer);
    console.log("avatar" , avatar);
    console.log(this.state);
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
                  <Typography gutterBottom variant="subtitle1"  noWrap style={{ fontWeight: 'bold', fontSize: 18}}>
                    {offer.title}
                  </Typography>
                  <Typography gutterBottom   noWrap style={{ fontWeight: 'bold'}}>
                    ${offer.cost}
                  </Typography>
                  <Typography gutterBottom>{offer.description}</Typography>
                  <Typography color="textSecondary"></Typography>
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
