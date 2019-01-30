import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

export const SaveProfile = (profile, userId) => {
  return firestore.collection("profiles").add({
    firstName: profile.firstName,
    lastName: profile.lastName,
    dob: profile.dob,
    gender: profile.gender,
    dependents: profile.dependents,
    userId: userId
  });
}

export const EditProfile = (id, profile) => {
  var ref = firestore.collection("profiles");
  return ref.doc(id)
  .update({
    firstName: profile.firstName,
    lastName: profile.lastName,
    dob: profile.dob,
    dependents: profile.dependents,
    gender: profile.gender,
  });
}

export const GetProfile= (userId, callback) => {
  let profiles = [];
  return firestore.collection("profiles")
  .where("userId", "==", userId)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        profiles.push({  id: doc.id, ...doc.data()});
      })
  })
  .then((doc) => {
      callback(profiles[0]);
  })
  .catch(function(error) {
      console.log("Error getting document:", error);
  });
}
