const DefaultOffer =  {
  title: '',
  organizationId: '',
  organizationName: '',
  organizationLogo: '',
  organizationWebsite: '',
  individualName: '',
  individualImageURL: '',
  individualWebsite: '',
  description: '',
  datetimeFrom: new Date().toISOString().split(".")[0],
  datetimeTo: new Date().toISOString().split(".")[0],
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
  tags: ''
}

export default DefaultOffer;
