const functions = require('firebase-functions');
const https = require('https');
var fs = require('fs');
var {google} = require('googleapis');
var PROJECT_ID = 'larayb-204122';
var HOST = 'fcm.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
var SCOPES = [MESSAGING_SCOPE];

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = require('./service-account.json');
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  getAccessToken().then( (accessToken) => {
  console.log(accessToken);

  const data = JSON.stringify({
    message:{
      notification: {
        title: 'FCM Message',
        body: 'This is an FCM Message',
      },
      token: 'cpVlKVVyOks:APA91bHFNu_c2jKMXVLiO3EVaEYz_WAu1zRtOXMHjvJNmFOZkgnRn3Q_WXE9Lf7IlAslG1aT1udviYZ3J0iHXcKYzntoHG_Sf9bUXuqSzqw4xgzVddWCdbPyRaWhhzICMfcJDPLW_e1W'
    }
  });

  var options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      // [START use_access_token]
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },

      // [END use_access_token]
    };

    var request = https.request(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(data) {
          console.log('Message sent to Firebase for delivery, response:');
          console.log(data);
          response.send(JSON.stringify(data));
        });
      });

      request.on('error', function(err) {
        console.log('Unable to send message to Firebase');
        console.log(err);
      });
      request.write(data);
      request.end();

    });


  });
