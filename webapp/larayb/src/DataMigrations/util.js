firestore.collection("offers").get().then(function(querySnapshot) {
querySnapshot.forEach(function(doc) {
    var cityRef = firestore.collection("offers").doc(doc.id);

    cityRef.get().then(function(offer) {
        // Document was found in the cache. If no cached document exists,
        // an error will be returned to the 'catch' block below.

        return cityRef.update({
            datetimeFrom: offer.data().datetime
        });
    }).catch(function(error) {
        console.log("Error getting cached document:", error);
    });

});
});
