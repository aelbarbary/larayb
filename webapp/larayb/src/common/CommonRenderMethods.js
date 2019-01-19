import React from 'react';
import {FormatOfferDate, FormatOfferTime} from './CommonFormatMethods';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import WebIcon from '@material-ui/icons/Language';
import IconButton from '@material-ui/core/IconButton';

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

export const RenderOfferWebsite = (offer) => {
  let href = '';
  if (offer.registrationURL !== ''){
    href  = offer.registrationURL;
  } else {
    if (offer.website !== undefined && offer.website !== ''){
        href = offer.website;
    } else if (offer.facebook !== undefined && offer.facebook !== ''){
        href = offer.facebook;
    }
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

export const RenderOfferPhone = (offer) => {

  if (offer.phone !== undefined && offer.phone !== ''){
    const href = 'tel:' + offer.phone
    return(

    <IconButton aria-label="Register" href={href}>
      <PhoneIcon />
    </IconButton>
  );
  } else{
    return ""
  }
}

export const RenderOfferCost = (offer) => {
  if (offer.cost !== 0){
    return `$${offer.cost}`;
  }
  if (offer.offerType === "product"){
      return "Call us";
  } else if (offer.offerType === "activity"){
      return "Free";
  }

}

export const RenderOfferEmail = (offer) => {
  if (offer !== undefined && offer.email !== undefined && offer.email.trim() !== ''){
    const href = 'mailto:' + offer.email;
    return(

    <IconButton aria-label="Email" href={href}>
      <EmailIcon />
    </IconButton>
  );
  } else{
    return ''
  }
}