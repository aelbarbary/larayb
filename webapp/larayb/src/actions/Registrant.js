import firebase from '../lib/firebase.js';
import {GetProfile} from './Profile.js';

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

export const SaveRegistrants = (registrants, userId, offerId) => {

  firestore.collection("registrants")
  .where("userId", "==", userId)
  .where("offerId", "==", offerId)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        firestore.collection("registrants").doc(doc.id).delete();
      });
   })
   .then( () =>{
     return firestore.collection("registrants").add({
       registrants: registrants.filter(obj => obj.registered === true),
       offerId: offerId,
       userId: userId
     });
   });
}


export const GetRegistrants= (userId, offerId, callback) => {
  let allRegistrants = [];

  // get user profile
  GetProfile(userId, (profile) => {
    allRegistrants.push({...profile, registered: false});

    profile.dependents.forEach(function(dependent) {
      allRegistrants.push({...dependent, registered: false});
    });

    let savedRegistrants = [];
    firestore.collection("registrants")
    .where("userId", "==", userId)
    .where("offerId", "==", offerId)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let registrantRecord = doc.data();
          registrantRecord.registrants.forEach(function(registrant){
            savedRegistrants.push({...registrant})
          })
        });

        allRegistrants.forEach(function(r){
          let obj = savedRegistrants.find(obj => obj.id === r.id);
          if (obj !== undefined){
            r.registered = true;
          }
        })

        callback(allRegistrants);
    });

  });

}
