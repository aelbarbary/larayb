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

const admin = require('firebase-admin');
admin.initializeApp();

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
  var config = require('./config.json');
  var secretKey= config.stripeSecretKey;

  const token = payment.token; // Using Express
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
  admin.firestore().collection("offers")
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

      const registrant = snap.data();
      const ownerUserId = registrant.ownerUserId;
      const userId = registrant.userId;
      const offerId = registrant.offerId;

      console.log(registrant);

      admin.firestore().collection("profiles")
      .where("userId", "==", userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const profile = doc.data();

          GetOffer(offerId, (offer) =>{
            console.log(offer);
            admin.firestore().collection("notifications").add({
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
    httpAdapter: 'https',
    apiKey: config.googleGeoAPIKey,
    formatter: null
  };

  var geocoder = NodeGeocoder(options);

  const offer = change.after.exists ? change.after.data(): null;
  const offerId = change.after.id;
  let address = GetAddress(offer);

  geocoder.geocode(address)
  .then(function(res) {
    console.log(res);
    return admin.firestore().collection("offers").doc(offerId)
      .update({
          location : new admin.firestore().GeoPoint(res[0].latitude, res[0].longitude)
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
