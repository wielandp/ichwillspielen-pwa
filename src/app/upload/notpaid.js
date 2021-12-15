// Imports
const Firestore = require('@google-cloud/firestore');
const serviceAccount = require('./serviceAccount.json');
// const firebaseConfig = require('./config.js');

const firestore = new Firestore({
    projectId: 'tkl-halle',
    keyFilename: 'serviceAccount.json', 
});

const parseall = async (p) => {  try {
    var query = await firestore.collection('users').get();
    var doc = await query.docs;
    console.log("code;paid;used;ts;email;name;key;doc");
    for (let index = 0; index < doc.length; index++) {
        const log = doc[index];
        // console.log("log=", log.ref);
        if (1 || log.ref.id === "ZmQ38mCZCFOKOwgUOpSR97luuSS2") {
            // console.log("log=", log.ref.id);
            // console.log("email=", log.get('email'));
            // console.log("text=", log.get('displayName'));    

            var c = await firestore.collection('users/'+log.ref.id+'/codes').get();
            var cd = await c.docs;
            for (let index = 0; index < cd.length; index++) {
                const l = cd[index];
                if (l.get('used') && !l.get('paid')) {
                    const d = l.get('ts').toDate();
                    console.log(`${l.ref.id};${l.get('paid')};${l.get('used')};${d.toLocaleDateString('de-DE')} ${d.toLocaleTimeString('de-DE')};${log.get('email')};${log.get('displayName')};users/${log.ref.id}/codes;${l.ref.id}`);    
                }
            }
        }
    } 
  }
  catch (error) {
    console.log(error);
  }
}

let p = "";

parseall(p);
