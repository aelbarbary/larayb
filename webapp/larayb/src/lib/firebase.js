import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBrAf9R7JNTbOHQpvmFxP5CXxU0RMtyTcM",
    authDomain: "larayb-204122.firebaseapp.com",
    databaseURL: "https://fun-food-friends-eeec7.firebaseio.com",
    projectId: "larayb-204122",
    storageBucket: "larayb-204122.appspot.com",
    messagingSenderId: "199149299950"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
