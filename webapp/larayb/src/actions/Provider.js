import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

export const GetProviders = (userId, callback) => {

  let providers = [];

  firestore.collection("provider")
  .where("userId", "==", userId)
  .orderBy("name")
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        providers.push({  id: doc.id, ...doc.data()});
      })
  })
  .then(()=>{
      callback(providers);
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
}

export const DeleteProvider = (id) => {
  firestore.collection("provider").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

export const GetProvider = (id, callback) => {

  var docRef = firestore.collection("provider").doc(id);

  docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
        callback(doc.data());
    } else {
        console.log("provider not found");
    }

  })
  .catch(function(error) {
      console.log("Error getting document:", error);
  });

}

export const InsertProvider = (provider, userId) => {
  return firestore.collection("provider").add({
    name: provider.name,
    description: provider.description,
    address: provider.address,
    city: provider.city,
    state: provider.state,
    zip: provider.zip,
    phone: provider.phone,
    email: provider.email,
    contact: provider.contact,
    website: provider.website,
    facebook: provider.facebook,
    instagram: provider.instagram,
    logo: provider.logo,
    userId: userId
  });
}

export const EditProvider = (id, provider) => {
  var ref = firestore.collection("provider");

  return ref.doc(id)
  .update({
    name: provider.name,
    description: provider.description,
    address: provider.address,
    city: provider.city,
    state: provider.state,
    zip: provider.zip,
    phone: provider.phone,
    email: provider.email,
    contact: provider.contact,
    website: provider.website,
    facebook: provider.facebook,
    instagram: provider.instagram,
    logo: provider.logo
  });
}
