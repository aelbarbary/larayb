import firebase from '../lib/firebase.js';
import Geocode from "react-geocode";

const GoogleMapAPIKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
Geocode.setApiKey(GoogleMapAPIKey);
const distance = 20;
const firestore = firebase.firestore();

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
  .limit(10)
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


export const GetOffers = (search, zipcode, callback) => {
  console.log("get offers");
  if (search === undefined && zipcode === undefined ) {
    GetAllOffers(callback);
  }
  else if (search === undefined ){
    GetOffersByZipcode(zipcode, callback);
  }
  else if(zipcode === undefined){
    GetOffersByQuery(search, callback);
  }
  else  {
    GetOfferByQueryAndZipcode(search, zipcode,callback);
  }
}

function GetAllOffers (callback) {
  console.log("get all offers");
  let offers = [];

  firestore.collection("offers")
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

function GetOffersByQuery (query, callback) {
  let offers = [];

  firestore.collection("offers")
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

function GetOffersByZipcode(zipcode, callback){
  let offers = [];
  Geocode.fromAddress(zipcode).then(
    response => {
      console.log(response);
      const { lat, lng } = response.results[0].geometry.location;
      let lat1 = 0.0144927536231884;
      let lon1 = 0.0181818181818182;

      let lowerLat = lat - (lat1 * distance);
      let lowerLon = lng - (lon1 * distance);

      let greaterLat = lat + (lat1 * distance);
      let greaterLon = lng + (lon1 * distance);
      let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLon);
      let greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLon);
      console.log(lesserGeopoint, greaterGeopoint);

      firestore.collection("offers")
      .where("active", "==", true)
      .where("location", ">=", lesserGeopoint)
      .where("location", "<=", greaterGeopoint)
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

    },
    error => {
      callback(offers);
    }
  );
}

function GetOfferByQueryAndZipcode(search, zipcode, callback){
  let offers = [];
  let query = search.trim().toLowerCase();
  Geocode.fromAddress(zipcode).then(
    response => {
      const { lat, lng } = response.results[0].geometry.location;
      let lat1 = 0.0144927536231884;
      let lon1 = 0.0181818181818182;

      let lowerLat = lat - (lat1 * distance);
      let lowerLon = lng - (lon1 * distance);

      let greaterLat = lat + (lat1 * distance);
      let greaterLon = lng + (lon1 * distance);
      let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLon);
      let greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLon);
      console.log(lesserGeopoint, greaterGeopoint);

      firestore.collection("offers")
      .where("active", "==", true)
      .where("tags", "array-contains", query)
      .where("location", ">=", lesserGeopoint)
      .where("location", "<=", greaterGeopoint)
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

    },
    error => {
      callback(offers);
    }
  );
}

export const GetOffersByUserId = (userId, viewSettings, callback) => {
  let offers = [];
  firestore.collection("offers")
  .where("userId", "==", userId)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        offers.push({  id: doc.id, ...doc.data(), viewSettings: viewSettings });
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
