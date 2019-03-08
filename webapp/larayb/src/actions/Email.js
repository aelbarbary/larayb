import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

export const SaveEmail = (email) => {
  return firestore.collection("emails").add({
    email: email
  });
}
