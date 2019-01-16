import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

export const SaveEmail = (email) => {
  console.log(email);

  return firestore.collection("emails").add({
    email: email
  });
}
