import React, { Component } from 'react';
import { buildUrl } from 'react-instafeed'


const options = {
  accessToken: '7354577097.0825c54.432e0e4c3ff448ae97ad028fdf5312bf',
  clientId: '0825c54704b546aa97eca2d0528f9929',
  get: 'user', // popular, user
  locationId: null,
  resolution: 'standard_resolution', // thumbnail, low_resolution, standard_resolution
  sortBy: 'none', // none, least-commented, least-liked, least-recent, most-commented, most-liked, most-recent, random
  tagName: null,
  userId: 123,
}

class Root extends Component {
  componentWillMount(){
    let url = buildUrl(options);
  }
  render() {
    return (
      <div >
        <h1> Hello </h1>
      </div>
    );
  }
}


export default Root;
