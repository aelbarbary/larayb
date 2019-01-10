import React from 'react';
import {FormatOfferDate, FormatOfferTime} from './CommonFormatMethods';
import Typography from '@material-ui/core/Typography';

export const RenderOfferDateTime = (offer) => {
  if (offer.title !== undefined){
    console.log(offer);
    if (offer.offerType === 'activity' || offer.offerType === undefined ){ // default is activity
        var date = FormatOfferDate(offer.datetimeFrom.toDate(), offer.datetimeTo.toDate()) ;
        var time = FormatOfferTime(offer.datetimeFrom.toDate(), offer.datetimeTo.toDate());
        return <div>
                  <Typography color="textSecondary">
                    {date}
                  </Typography>
                  <Typography color="textSecondary">
                    {time} {offer.every !== undefined && offer.every !== '' && " - Every " + offer.every}
                  </Typography>
              </div>
    } else {
      return ""   // product has no dates
    }
  }
}
