import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const SaveOffer = (offer, userId) => {
  const tags = offer.tags.map(tag => tag.text);

  return firestore.collection("offers").add({
    title: offer.title,
    description: offer.description,
    offerType: offer.offerType,
    provider: offer.provider,
    datetimeFrom: new Date(Date.parse(offer.datetimeFrom)),
    datetimeTo: new Date(Date.parse(offer.datetimeTo)),
    every: offer.every,
    fullDay: offer.fullDay,
    address: offer.address,
    city: offer.city,
    state: offer.state,
    zip: offer.zip,
    phone: offer.phone,
    contact: offer.contact,
    email: offer.email,
    registrationURL: offer.registrationURL,
    useLaraybRegistrationSystem: offer.useLaraybRegistrationSystem,
    website: offer.website,
    gender: offer.gender,
    cost: offer.cost,
    image: offer.image,
    active: offer.active,
    tags: tags,
    userId: userId
  });
}

export const EditOffer = (id, offer) => {
  var offerRef = firestore.collection("offers");
  const tags = offer.tags.map(tag => tag.text);
  return offerRef.doc(id)
  .update({
    title: offer.title,
    description: offer.description,
    offerType: offer.offerType,
    provider: offer.provider,
    datetimeFrom: new Date(Date.parse(offer.datetimeFrom)),
    datetimeTo: new Date(Date.parse(offer.datetimeTo)),
    every: offer.every,
    fullDay: offer.fullDay,
    address: offer.address,
    city: offer.city,
    state: offer.state,
    zip: offer.zip,
    phone: offer.phone,
    contact: offer.contact,
    email: offer.email,
    registrationURL: offer.registrationURL,
    useLaraybRegistrationSystem: offer.useLaraybRegistrationSystem,
    website: offer.website,
    gender: offer.gender,
    cost: offer.cost,
    image: offer.image,
    active: offer.active,
    tags: tags,
    userId: offer.userId
  });
}

export const GetOffer = (offerId, callback) => {
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

export const GetOffersByProvider = (providerId, callback) => {
  let offers = [];
  return firestore.collection("offers")
  .where("active", "==", true)
  .where("provider.id", "==", providerId)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        offers.push({  id: doc.id, ...doc.data()});
      })
  })
  .then((doc) => {
      callback(offers);
  })
  .catch(function(error) {
      console.log("Error getting document:", error);
  });
}

export const DeleteOffer = (id) => {
  firestore.collection("offers").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

export const GetOffers = (callback) => {

  let offers = [];
  firestore.collection("offers")
  .where("datetimeTo", ">=", new Date())
  .where("offerType", "==", "activity")
  .where("active", "==", true)
  .orderBy("datetimeTo")
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        offers.push({  id: doc.id, ...doc.data()});
      })
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });

  firestore.collection("offers")
  .where("offerType", "==", "product")
  .where("active", "==", true)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        offers.push({  id: doc.id, ...doc.data()});
      })
  })
  .then(()=>{
      callback(offers);
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });

}

export const GetOffersByQuery = (query, callback) => {
  let offers = [];
  firestore.collection("offers")
  .where("datetimeTo", ">=", new Date())
  .where("active", "==", true)
  .where("offerType", "==", "activity")
  .where("tags", "array-contains", query)
  .orderBy("datetimeTo")
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        offers.push({  id: doc.id, ...doc.data()});
      })
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });

  firestore.collection("offers")
  .where("offerType", "==", "product")
  .where("active", "==", true)
  .where("tags", "array-contains", query)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        offers.push({  id: doc.id, ...doc.data()});
      })
  })
  .then(()=>{
      callback(offers);
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
}

export const GetOffersByUserId = (userId, callback) => {
  let offers = [];
  firestore.collection("offers")
  .where("userId", "==", userId)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        offers.push({  id: doc.id, ...doc.data()});
      })
  })
  .then(()=>{
      callback(offers);
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
}

export default SaveOffer;
