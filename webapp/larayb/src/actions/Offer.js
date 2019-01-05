import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();


export const GetOffer = (offerId, callback) => {
  console.log(offerId);
  var docRef = firestore.collection("offers").doc(offerId);

  docRef
  .get()
  .then((doc) => {
    if (doc.exists) {

        callback(doc.data());
    } else {
        console.log("offer not found");
    }

  })
  .catch(function(error) {
      console.log("Error getting document:", error);
  });

}

const SaveOffer = (offer, userId) => {
  const tags = offer.tags.split(",");
  console.log(offer);
  return firestore.collection("offers").add({
    title: offer.title,
    description: offer.description,
    offerType: offer.offerType,
    provider: offer.provider,
    datetimeFrom: new Date(Date.parse(offer.datetimeFrom)),
    datetimeTo: new Date(Date.parse(offer.datetimeTo)),
    every: offer.every,
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
    provider: offer.provider,
    datetimeFrom: new Date(Date.parse(offer.datetimeFrom)),
    datetimeTo: new Date(Date.parse(offer.datetimeTo)),
    every: offer.every,
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
