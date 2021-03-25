// Imports
const Firestore = require('@google-cloud/firestore');
// const serviceAccount = require('./serviceAccount.json');
// const firebaseConfig = require('./config.js');

const firestore = new Firestore({
    projectId: 'tkl-halle',
    keyFilename: 'serviceAccount.json', 
});

const email2uid = async (email) => {  try {
    var query = await firestore.collection('users').where('email','==', email).get();
    var doc = await query.docs;
    if (doc.length < 1) { return undefined; }
    return doc[0].get('uid');
  } catch (error) {
    console.log(error);
  }
}

const clipboard = require('copy-paste');
// import * as CSV from 'csv-string';
const CSV = require('csv-string');
 
function mystrip(s, l) {
    return s.substr(l, s.length - l - 1);
}

const parseall = async (p) => {  try {
    // with String
    var user;
    var uid;
    const arr = CSV.parse(p);
 
    for (let i = 0; i < arr.length; i++) {
        var line = arr[i];
        // console.log("line ", line.length);
        if (line.length < 2) {
          console.log("Fehler: Clipboard muss zwei Spalten enthalten.");
          return;
        }
        if (line[0]) {
            user = line[0];
            console.log("user=", user);
            uid = await email2uid(user);
            console.log("user uid=", uid);
        }
        data = CSV.parse(line[1].substr(1, line[1].length - 3));  // 
        data = data[0];     // only one line
        data[0] = mystrip(data[0], 1);
        // console.log("data=", data[0]);
        data[3] = mystrip(data[3].trim(), 1);
        // console.log("data=", data[3]);
        data[4] = mystrip(data[4].trim(), 1);
        // console.log("data=", data[4]);
        console.log("user="+user+" uid="+uid+" data=", data);
        var col = await firestore.collection(`users/${uid}/codes`);
        var name = data[0]+"-"+data[1]+"-"+data[2];
        col.doc(name).set({lfdnr: data[2], code: data[3], name: name, used: false, wert: data[1], paid: false}).then(doc => {
            // console.log(`Added document with name: ${doc.id}`);
        }, error => {
            console.log(`Added document with error`);
        });
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