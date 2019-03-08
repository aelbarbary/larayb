import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { RenderOfferDateTime} from "../../../common/CommonRenderMethods.js"

const styles = theme => ({
  root: {
    flexGrow: 1,
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

function OfferDetails(props) {
  const { classes, offer, showDescription } = props;
  const offerDateTime = RenderOfferDateTime(offer);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={16}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.image} alt="complex" src={offer.image} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={16}>
              <Grid item xs>
                <Typography gutterBottom variant="h4" >
                  {offer.title}
                </Typography>
                <Typography gutterBottom>{ showDescription === false ? '':  offer.description }</Typography>
                <Typography color="textSecondary">{offerDateTime}</Typography>
              </Grid>
              {/*<Grid item>
                <Typography style={{ cursor: 'pointer' }}>Remove</Typography>
              </Grid>*/}
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{marginLeft: '30px', color:'blue'}}>${offer.cost}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

OfferDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OfferDetails);
