// Imports
const Firestore = require('@google-cloud/firestore');
const serviceAccount = require('./serviceAccount.json');
// const firebaseConfig = require('./config.js');

const firestore = new Firestore({
    projectId: 'tkl-halle',
    keyFilename: 'serviceAccount.json', 
});

const parseall = async (p) => {  try {
    var query = await firestore.collection('info').where('id','>', 1).get();
    var doc = await query.docs;
    for (let index = 0; index < doc.length; index++) {
        const log = doc[index];
        // console.log("log=", log.ref);
        console.log("log=", log.ref.id);
        console.log("text=", log.get('text'));
        // log.ref.delete();
        // return;
    } 
  }
  catch (error) {
    console.log(error);
  }
}

let p = "";

parseall(p);
