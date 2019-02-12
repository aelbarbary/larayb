import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

export const GetNotifications= (userId, callback) => {
  let notifications = [];

    firestore.collection("notifications")
    .where("userId", "==", userId)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let notification = doc.data();
            notifications.push(notification)
        });

        callback(notifications);
    });

}


export const MarkNotificationsAsRead= (userId) => {
  firestore.collection("notifications")
  .where("userId", "==", userId)
  .where("read", "==", false)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        firestore.collection("notifications").doc(doc.id).update({read: true});
      });
   });
 }
