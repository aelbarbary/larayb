import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

const SaveOffer = (offer, userId) => {
  const tags = offer.tags.split(",");
  return firestore.collection("offers").add({
    title: offer.title,
    description: offer.description,
    offerType: offer.offerType,
    providerId: offer.provider.id,
    datetimeFrom: new Date(Date.parse(offer.datetimeFrom)),
    datetimeTo: new Date(Date.parse(offer.datetimeTo)),
    address: offer.address,
    city: offer.city,
    state: offer.state,
    zip: offer.zip,
    phone: offer.phone,
    contact: offer.contact,
    registrationURL: offer.registrationURL,
    gender: offer.gender,
    cost: offer.cost,
    image: offer.image,
    approved: offer.approved,
    tags: tags,
    userId: userId
  });
}

export const EditOffer = (id, offer) => {
  console.log(id);
  var offerRef = firestore.collection("offers");
  const tags = offer.tags.split(",");
  return offerRef.doc(id)
  .update({
    title: offer.title,
    description: offer.description,
    offerType: offer.offerType,
    providerId: offer.provider.id,
    datetimeFrom: new Date(Date.parse(offer.datetimeFrom)),
    datetimeTo: new Date(Date.parse(offer.datetimeTo)),
    address: offer.address,
    city: offer.city,
    state: offer.state,
    zip: offer.zip,
    phone: offer.phone,
    contact: offer.contact,
    registrationURL: offer.registrationURL,
    gender: offer.gender,
    cost: offer.cost,
    image: offer.image,
    approved: offer.approved,
    tags: tags,
    userId: offer.userId
  });
}

// export const ApproveOffer = (id) => {
//   console.log(id);
//   var offerRef = firestore.collection("offers");
//   return offerRef.doc(id)
//   .update({
//     approved: 1
//   });
// }


export default SaveOffer;
