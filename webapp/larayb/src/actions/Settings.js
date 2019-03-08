import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

export const SaveSettings = (settings, userId) => {
  return firestore.collection("settings").add({
    facebookPage: settings.facebookPage,
    instagramProfile: settings.instagramProfile,
    userId: userId
  });
}

export const EditSettings = (id, settings) => {
  var settingsRef = firestore.collection("settings");
  return settingsRef.doc(id)
  .update({
    facebookPage: settings.facebookPage,
    instagramProfile: settings.instagramProfile,
  });
}

export const GetSettings= (userId, callback) => {
  let settings = [];
  return firestore.collection("settings")
  .where("userId", "==", userId)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        settings.push({  id: doc.id, ...doc.data()});
      })
  })
  .then((doc) => {
      callback(settings[0]);
  })
  .catch(function(error) {
      console.log("Error getting document:", error);
  });
}
