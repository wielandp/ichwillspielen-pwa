// Imports
const Firestore = require('@google-cloud/firestore');
// const serviceAccount = require('./serviceAccount.json');
// const firebaseConfig = require('./config.js');

const firestore = new Firestore({
    projectId: 'tkl-halle',
    keyFilename: 'serviceAccount.json', 
});

// const email2uid = async (email) => {  try {
//     var query = await firestore.collection('users').where('email','==', email).get();
//     var doc = await query.docs;
//     if (doc.length < 1) { return undefined; }
//     return doc[0].get('uid');
//   } catch (error) {
//     console.log(error);
//   }
// }

const clipboard = require('copy-paste');
// import * as CSV from 'csv-string';
const CSV = require('csv-string');
 
// function mystrip(s, l) {
//     return s.substr(l, s.length - l - 1);
// }

const parseall = async (p) => {  try {
    // with String
    var user;
    var name;
    var uid;
    const arr = CSV.parse(p);
 
    for (let i = 0; i < arr.length; i++) {
        var line = arr[i];
        console.log("line ", line.length);
        if (line.length != 2) {
          console.log("Fehler: Clipboard muss zwei Spalten enthalten.");
          return;
        }
        if (line[0]) {
            key = line[0];
            name = line[1];
            console.log("key=", key);
            console.log("name=", name);
            // uid = await email2uid(user);
            // console.log("user uid=", uid);
        }
        
        // var col = await firestore.collection(`$key`);
        // col.doc(name).set({paid: true}).then(doc => {
        //     console.log(`Added document with name: ${doc.id}`);
        // }, error => {
        //     console.log(`Added document with error`);
        // });
    };
  }
  catch (error) {
    console.log(error);
  }
}

// JSON To Firestore
const jsonToFirestore = async () => { try {
    // console.log('Initialzing Firebase');
    // await firebase.App.initializeApp(serviceAccount, firebaseConfig.databaseURL);
    // const db = firebase.firestore();
    // console.log('Firebase Initialized');
    
    clipboard.paste(function (error_when_paste, p) {
        if (p) {
            // console.log(p);
            parseall(p);
        } else {
            console.log("clip empty");
        }
    });
  } catch (error) {
    console.log(error);
  }
};

jsonToFirestore();