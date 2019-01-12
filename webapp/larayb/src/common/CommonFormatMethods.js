import moment from 'moment';

export const FormatAddressHelper = (address, city, state, zip) => {
  var formattedAddress = "";
  if (address){
    formattedAddress += address + ", ";
  }
  if (city){
    formattedAddress += city + ", "
  }
  if (state){
    formattedAddress += state + " "
  }
  if (zip){
    formattedAddress += zip
  }

  return formattedAddress.trim();
}

export const FormatOfferDate = (datetimeFrom, datetimeTo) => {
  const dateFormat = "MMM, DD YYYY";
  var fromMoment = moment(datetimeFrom).utc();
  var toMoment = moment(datetimeTo).utc();

  if (! toMoment.isAfter( fromMoment, "day" )) {
    return fromMoment.format(dateFormat);
  } else {
      return fromMoment.format(dateFormat) + " to " + toMoment.format(dateFormat);
  }
}

export const FormatOfferTime = (datetimeFrom, datetimeTo) => {
  const timeFormat = "hh:mm A";
  var fromMoment = moment(datetimeFrom).utc();
  var toMoment = moment(datetimeTo).utc();

  if (minutesOfDay(toMoment) === minutesOfDay(fromMoment)) {
    return fromMoment.format(timeFormat);
  } else {
      return fromMoment.format(timeFormat) + " to " + toMoment.format(timeFormat);
  }
}

var minutesOfDay = function(m){
  return m.minutes() + m.hours() * 60;
}

export const IsEmpty = (value) => {
  return value === undefined || value.trim() === ""
}
