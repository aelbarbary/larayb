import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

const SaveOffer = (offer, userId) => {

    // var storageRef = firebase.storage().ref();
    return addOffer(offer, userId);
    // if (offer.imageFile === undefined){
    //
    // } else{
    //   storageRef.child(offer.imageFile.name)
    //   .put(offer.imageFile)
    //   .then(function(){
    //      storageRef.child(offer.imageFile.name).getDownloadURL().then((url) => {
    //       return addOffer(url);
    //     });
    //   });
    // }
}

const addOffer = (offer, userId) => {
    return firestore.collection("offers").add({
    title: offer.title,
    organizationId: offer.organizationId,
    organizationName: offer.organizationName,
    organizationLogo: offer.organizationLogo,
    organizationWebsite: offer.organizationWebsite,
    individualName: offer.individualName,
    individualImageURL: offer.individualImageURL,
    individualWebsite: offer.individualWebsite,
    description: offer.description,
    datetimeFrom: new Date(Date.parse(offer.datetimeFrom)),
    datetimeTo: new Date(Date.parse(offer.datetimeTo)),
    address: offer.address,
    city: offer.city,
    state: offer.state,
    zip: offer.zip,
    phone: offer.phone,
    contact: offer.contact,
    registrationURL: offer.registrationURL,
    gender: offer.gender,
    cost: offer.cost,
    image: offer.image,
    approved: 0,
    userId: userId
  });
}

export default SaveOffer;
