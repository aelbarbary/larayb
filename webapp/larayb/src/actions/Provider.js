import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

const GetProviders = () => {
  return firestore.collection("provider").orderBy('name').get();
}


export default GetProviders;
