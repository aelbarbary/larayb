import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

const GetProviders = () => {
  return firestore.collection("provider").orderBy('name').get();
}

export const DeleteProvider = (id) => {
  firestore.collection("provider").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}


export default GetProviders;
