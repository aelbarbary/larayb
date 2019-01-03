import moment from 'moment';

const FormatAddressHelper = (address, city, state, zip) => {
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
  var fromMoment = moment(datetimeFrom);
  var toMoment = moment(datetimeTo);

  if (! toMoment.isAfter( fromMoment, "day" )) {
    return moment(datetimeFrom).format(dateFormat);
  } else {
      return moment(datetimeFrom).format(dateFormat) + " to " + moment(datetimeTo).format(dateFormat);
  }
}

export const FormatOfferTime = (datetimeFrom, datetimeTo) => {
  const timeFormat = "hh:mm A";
  var fromMoment = moment(datetimeFrom);
  var toMoment = moment(datetimeTo);

  if (minutesOfDay(toMoment) === minutesOfDay(fromMoment)) {
    return moment(datetimeFrom).format(timeFormat);
  } else {
      return moment(datetimeFrom).format(timeFormat) + " to " + moment(datetimeTo).format(timeFormat);
  }
}

var minutesOfDay = function(m){
  return m.minutes() + m.hours() * 60;
}

export default FormatAddressHelper;
