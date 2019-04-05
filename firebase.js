import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDvBgbKve0fm-z-eWtPWJVjD1yC-MBZetE",
    authDomain: "cookbook-faa0e.firebaseapp.com",
    databaseURL: "https://cookbook-faa0e.firebaseio.com/",
    projectId: "cookbook-faa0e",
    storageBucket: "cookbook-faa0e.appspot.com",
    messagingSenderId: "959432363043"
};
firebase.initializeApp(config);

export default firebase;
