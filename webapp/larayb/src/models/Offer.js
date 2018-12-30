var d = new Date();
d.setHours(0);
d.setMinutes(0);
d.setSeconds(0);
d.setMilliseconds(0);

const DefaultOffer =  {
  title: '',
  provider: {},
  description: '',
  datetimeFrom: d.toISOString().split(".")[0],
  datetimeTo: d.toISOString().split(".")[0],
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
