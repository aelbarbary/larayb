// import Geocode from "react-geocode";
const functions = require('firebase-functions');
const https = require('https');
var fs = require('fs');
var {google} = require('googleapis');
// var PROJECT_ID = 'larayb-204122';
// var HOST = 'fcm.googleapis.com';
// var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
// var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
// var SCOPES = [MESSAGING_SCOPE];
const fetch = require('node-fetch');
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

// add notifiactions when a new registration takes place
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

          let totalRegistrants = 0;
          admin.firestore().collection("registrants")
          .where("offerId", "==", offerId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const registrant = doc.data();
              console.log("registrant", registrant);
              totalRegistrants = totalRegistrants +  registrant.registrants.length;
            });

            console.log("totalRegistrants", totalRegistrants);
            return admin.firestore().collection("offers").doc(offerId)
            .update({
                totalRegistrants : totalRegistrants
            })
            .catch(function(error) {
                console.log("Error updating totalRegistrants:", error);
            });
          })
          .catch(function(error) {
              console.log("Error getting document:", error);
          });

        });
        return 'OK';
      })
      .catch(function(error) {
          console.log("Error getting document:", error);
      });
    });

exports.updateOfferLocations = functions.https.onRequest((req, res) => {
    var config = require('./config.json');

    admin.firestore().collection("offers")
    .get()
    .then((querySnapshot) => {
      return querySnapshot.forEach((doc) => {
        const offer = doc.data();
        if (offer.location === undefined || offer.location === null){
          console.log("updating locations");
          let address = GetAddress(offer);
          let offerId = doc.id;
          let url = `http://www.mapquestapi.com/geocoding/v1/address?key=${config.mapquestKey}&location=${address}`;
          console.log("url", url);
          fetch(url,{
           headers: {
           'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
           'Content-Type': 'application/json'
           },
           method : 'GET'
           })
           .then(function(response) {
             return response.json();
           })
           .then(json =>{
             const lat = json.results[0].locations[0].latLng.lat;
             const lng = json.results[0].locations[0].latLng.lng;
             return admin.firestore().collection("offers").doc(offerId).update({
                   location : new admin.firestore.GeoPoint(lat, lng)
               })
               .catch(function(error) {
                   console.log("Error updating document:", error);
               });
           })
           .catch(function(error){
             console.log("error")
             console.log(error)
           });
         }
      });
    })
    .then(()=>{
      const ok = 'Ok'
      return res.status(200).send(ok);
    })
    .catch(function(err) {
      console.log("error", err);
    });


});

function GetAddress(offer) {
  if (offer === null){
    return null;
  }
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
