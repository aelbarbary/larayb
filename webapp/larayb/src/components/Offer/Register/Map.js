import React, { PureComponent }  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GoogleMapReact from 'google-map-react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Geocode from "react-geocode";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const GoogleMapAPIKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
Geocode.setApiKey(GoogleMapAPIKey);

const styles = theme => ({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  }
});

class Map extends PureComponent {
  state = {
    zoom: 11,
    totalCost: 0,
    center: null,
   };

  componentWillMount(){
    var {address} = this.props;
    Geocode.fromAddress(address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          this.setState({center: {lat: lat, lng: lng}});
        },
        error => {
          console.error(error);
        }
      );
  }

  render(){
    const { classes, height } = this.props;
    const Location = () => (
      <GoogleMapReact
            bootstrapURLKeys={{ key:GoogleMapAPIKey}}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
          >
            <div
              lat={this.state.center.lat}
              lng={this.state.center.lng}
              >
              <LocationOnIcon />
            </div>
        </GoogleMapReact>
    );
    return (

      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent style={{padding: 0}}>
          <div style={{ height: height, width: '100%' }}>
              {this.state.center !== null? <Location/> : <div/>}
          </div>
          </CardContent>
        </div>
      </Card>
  );
  }
}

Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);
