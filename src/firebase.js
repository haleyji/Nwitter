import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBGUZSQOfBpTQS9LK4pNnGNrRGQ7NbP1kc",
    authDomain: "nwitter-c9bb2.firebaseapp.com",
    projectId: "nwitter-c9bb2",
    storageBucket: "nwitter-c9bb2.appspot.com",
    messagingSenderId: "855377562083",
    appId: "1:855377562083:web:efd9a888ab0fc66dc2b8d6"
  };

  export default firebase.initializeApp(firebaseConfig);