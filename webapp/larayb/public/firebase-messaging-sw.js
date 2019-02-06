/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


// 'use strict';
// //importScripts('./build/sw-toolbox.js');
// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// firebase.initializeApp({
//   'messagingSenderId': '199149299950'
// });
//
// const messaging = firebase.messaging();
//
// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };
//   self.clients.matchAll({includeUncontrolled: true}).then(function (clients) {
//        console.log(clients);
//        //you can see your main window client in this list.
//        clients.forEach(function(client) {
//            client.postMessage(payload);
//        })
//      })
//   // return self.registration.showNotification(notificationTitle,
//   //     notificationOptions);
// });
