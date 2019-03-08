import React, { Component } from 'react';
import OfferCardUser from  './OfferCardUser';
import OfferCardAdmin from  './OfferCardAdmin';


class OfferCard extends Component {
  render() {
    const { offer } = this.props;
    const offerCard = offer.viewSettings !== undefined && offer.viewSettings.adminView === true?
        <OfferCardAdmin offer = {offer} /> : <OfferCardUser offer = {offer} />
    return (
      <div>
        {offerCard}
      </div>
    );
  }
}

export default OfferCard;
