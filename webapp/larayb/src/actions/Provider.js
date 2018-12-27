import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

const GetProviders = () => {
  return firestore.collection("provider").get();
}

export default GetProviders;
