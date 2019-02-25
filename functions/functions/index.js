// import Geocode from "react-geocode";
const functions = require('firebase-functions');
const https = require('https');
var fs = require('fs');
var {google} = require('googleapis');
var PROJECT_ID = 'larayb-204122';
var HOST = 'fcm.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
var SCOPES = [MESSAGING_SCOPE];
var firebase = require('firebase');

// function getAccessToken() {
//   return new Promise(function(resolve, reject) {
//     var key = require('./service-account.json');
//     var jwtClient = new google.auth.JWT(
//       key.client_email,
//       null,
//       key.private_key,
//       SCOPES,
//       null
//     );
//     jwtClient.authorize(function(err, tokens) {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(tokens.access_token);
//     });
//   });
// }

exports.onPaymentWrite = functions.firestore
.document('payments/{paymentId}')
.onWrite((change, context) => {

  const payment = change.after.exists ? change.after.data(): null;
  const paymentId = change.after.id;
  console.log(payment);
  var config = require('./config.json');
  console.log("config", config);
  var secretKey= config.stripeSecretKey;

  const token = payment.token; // Using Express
  console.log("token", token);
  var stripe = require("stripe")(secretKey);

  stripe.charges.create({
    amount: payment.amount,
    currency: 'usd',
    description: 'Example charge',
    source: token,
  })
  .then(function(charge) {
    console.log(charge);
    return '';
  })
  .catch(function(error) {
    console.log(error);
    return '';
  });

});


function GetOffer(offerId, callback){
  var firebase = require('firebase');
  firebase.firestore().collection("offers")
  .doc(offerId)
  .get()
  .then((doc) => {
    if (doc.exists) {
        return callback(doc.data());
    } else {
        console.log("offer not found");
    }
    return '';
  })
  .catch(function(error) {
      console.log("Error getting document:", error);
  });
}

exports.onEventRegistration = functions.firestore
    .document('registrants/{registrantId}')
    .onCreate((snap, context) => {
      var config = require('./config.json');

      var firebase = require('firebase');
      try{
        firebase.initializeApp(config);
      }catch(err){
        console.error('Firebase initialization error', err.stack);
      }

      const registrant = snap.data();
      const ownerUserId = registrant.ownerUserId;
      const userId = registrant.userId;
      const offerId = registrant.offerId;

      console.log(registrant);

      firebase.firestore().collection("profiles")
      .where("userId", "==", userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const profile = doc.data();

          GetOffer(offerId, (offer) =>{
            console.log(offer);
            firebase.firestore().collection("notifications").add({
              userId: ownerUserId,
              message: `${profile.firstName} has registered to your event ${offer.title}.`,
              icon: '',
              link: '',
              read: false
            });
          });

        });
        return 'OK';
      })
      .catch(function(error) {
          console.log("Error getting document:", error);
      });
    });


exports.onOfferWrite = functions.firestore
.document('offers/{offerId}')
.onWrite((change, context) => {
  var config = require('./config.json');

  var NodeGeocoder = require('node-geocoder');

  var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: config.googleGeoAPIKey, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

  var geocoder = NodeGeocoder(options);

  var firebase = require('firebase');
  try{
    firebase.initializeApp(config);
  }catch(err){
    console.error('Firebase initialization error', err.stack);
  }

  const offer = change.after.exists ? change.after.data(): null;
  const offerId = change.after.id;
  console.log(offerId);
  let address = GetAddress(offer);
  console.log(address);

  geocoder.geocode(address)
  .then(function(res) {
    console.log(res);
    return firebase.firestore().collection("offers").doc(offerId)
      .update({
          location : new firebase.firestore.GeoPoint(res[0].latitude, res[0].longitude)
      });
  })
  .catch(function(err) {
    console.log(err);
  });

});

function GetAddress(offer) {
  var formattedAddress = "";
  if (offer.address){
    formattedAddress += offer.address + ", ";
  }
  if (offer.city){
    formattedAddress += offer.city + ", "
  }
  if (offer.state){
    formattedAddress += offer.state + " "
  }
  if (offer.zip){
    formattedAddress += offer.zip
  }

  return formattedAddress.trim();
}
