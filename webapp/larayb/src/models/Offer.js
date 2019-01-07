import moment from 'moment';

var d = new Date();
d.setHours(0);
d.setMinutes(0);
d.setSeconds(0);
d.setMilliseconds(0);
const date = moment(d).format('YYYY-MM-DDTHH:mm');

const DefaultOffer =  {
  title: '',
  provider: {},
  description: '',
  datetimeFrom: date,
  datetimeTo: date,
  offerType: 'activity',
  every: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  contact: '',
  registrationURL: '',
  gender: '',
  userId: '',
  image: '',
  cost: 0,
  tags: '',
  approved: true
}

export default DefaultOffer;
