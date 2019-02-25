import firebase from '../lib/firebase.js';

const firestore = firebase.firestore();

export const InsertPayment = (payment) => {
  return firestore.collection("payments").add({
    ...payment,
    amount: parseInt(payment.amount)
  });
}
