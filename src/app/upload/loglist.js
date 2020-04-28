// Imports
const Firestore = require('@google-cloud/firestore');
const serviceAccount = require('./serviceAccount.json');
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

const parseall = async (p) => {  try {
    var mem = [];
    var query = await firestore.collection('log').orderBy('ts', 'desc').get();
    // ('user','==', ', ')    .where('uid','==', '')
    var doc = await query.docs;
    for (let index = 0; index < doc.length; index++) {
        let info = {};
        const log = doc[index];
        console.log("log=", log.ref.id);
        console.log("ts=", new Date(log.get('ts')._seconds * 1000));
        info.email = log.get('email');
        if (user !== "") {
          console.log("email="+info.email);
        }
        var user = log.get('user');
        if (user === ", ") {
          console.log("empty");
          info.user_empty = true;
          // log.ref.delete();
        }
        if (log.get('uid') === "") {
          if (mem[user]) {
            console.log("double");
            info.user_double = true;
            // log.ref.delete();
          }
          console.log("user=", user);
          mem[user] = 1;
          // log.ref.delete();
          // return;
        }

        var histquery = await firestore.collection('log/'+log.ref.id+'/hist').orderBy('ts', 'desc').get();
        // ('user','==', ', ')    .where('uid','==', '')
        var hists = await histquery.docs;
        for (let i = 0; i < hists.length; i++) {
          const hist = hists[i];
          console.log("     hist=", hist.ref.id);
          console.log("     ts=", new Date(hist.get('ts')._seconds * 1000).toLocaleString());
          console.log("     start=", new Date(hist.get('start')._seconds * 1000).toLocaleString());
          console.log("     email=", hist.get('email'));
          console.log("     user=", hist.get('user'));
          info.has_hist++;
        }

        if (info.user_empty && !info.email && !info.has_hist) {
          console.log("empty -> delete");
          log.ref.delete();
        }
        if (info.user_double && !info.email && !info.has_hist) {
          console.log("double -> delete");
          log.ref.delete();
        }
        console.log

        console.log("");
    } 
  }
  catch (error) {
    console.log(error);
  }
}

let p = "";

parseall(p);
