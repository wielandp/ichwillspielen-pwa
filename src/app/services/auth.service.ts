import { Injectable } from '@angular/core';
import { User } from "../services/user";
import { auth, firestore } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { Router } from "@angular/router"; 

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Event } from "../event";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: Observable<User>;

  constructor(
    // public db: AngularFireDatabase,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    // public router: Router,  
    // public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
            if (user) {
                // console.log("user change uid="+user.uid+" user=", user);
                // console.log("constructor if user");
                this.updateUserData(user, "", "");
                return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            } else {
                // Logged out
                return of(null);
            }
        })
    );
  }



//   // Returns true when user is looged in and email is verified
//   isLoggedIn(): boolean {
//     return this.user$ != null;
//   }

  // // Sign in with Email
  // async EmailAuth() {
  //   console.log("auth with email");
  //   return null;
  // }

  // Sign in with Google
  async GoogleAuth(username: string, userpw: string) {
    const provider = new auth.GoogleAuthProvider()
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    // this.afAuth.auth.signInWithRedirect(provider);
    // const credential = await this.afAuth.auth.getRedirectResult();
    // console.log("googleauth");
    return this.updateUserData(credential.user, username, userpw);
  }

  getAllCfg() {
      let data;
      // console.log("getAllCfg");

      let doc = this.afs.doc('users/all');
      // console.log('doc:', doc);
      return doc.ref.get();
  }

  async changeUserCfg(uid: string, layout: string) {
    // console.log("changeUserVfg uid: "+uid+" layout="+layout);
    let doc = await this.afs.doc('users/'+uid).set({layout: layout}, { merge: true });
}

  async pay(wert: number, uid: string) {
    //   console.log("auth pay wert="+wert+" uid="+uid);
      let query = await this.afs.collection('users/'+uid+'/codes').ref.where('wert', '==', wert+"").where('used', '==', false).limit(1).get();
      let docs = await query.docs;
    //   console.log("auth pay arr len="+docs.length);
      if (docs.length > 0) {
          docs[0].ref.set({used: true, ts: firestore.Timestamp.now()}, { merge: true });
      }
      return docs;
  }

  log_booking(version:string, uid:string, email:string, event:Event) {
    console.log("log_booking v="+version+" uid="+uid+" email="+email+" event=", event);
    let uid2 = uid;
    if (uid) {
      uid2 = 'uid:'+uid;
      let col = this.afs.collection('log').doc(uid2).collection('hist').add({
        version: version,
        uid: uid,
        email: email,
        ts: firestore.Timestamp.now(),
        user: event.lastname+", "+event.firstname,
        start: new Date(event.start * 1000),
        code: event.telnumber,
      }).then(ref => {
        console.log('logged hist with ID: ', ref.id);
      });
    }
  }

  log_version(version:string, uid:string, email:string, firstname:string, lastname:string) {
    // console.log("log V"+version+" uid="+uid);
    if (uid) {
      let col = this.afs.collection('log').doc('uid:'+uid).set({
        version: version,
        uid: uid,
        email: email,
        ts: firestore.Timestamp.now(),
        user: lastname+", "+firstname,
      }, {merge: true});
    } else {
      let col = this.afs.collection('log').add({
        version: version,
        uid: uid,
        ts: firestore.Timestamp.now(),
        user: lastname+", "+firstname,
      }).then(ref => {
        console.log('logged with ID: ', ref.id);
      });
    }
  }

  getmyhist(uid:string) {
    return this.afs.collection('log/uid:'+uid+'/hist').ref.orderBy("ts", "desc").limit(10).get(); //   snapshotChanges();
  }

  getmyCodes(uid:string) {
    return this.afs.collection('users/'+uid+'/codes').ref.where("used", "==", true).limit(50).get(); //   snapshotChanges();
  }

  codes() {
      let codes = {count: 0, count18: 0, count21: 0, count26: 0};
      // console.log("auth codes");
      this.user$.subscribe( async user => {
        // console.log("codes user=", user);
        codes.count=0; codes.count18=0; codes.count21=0; codes.count26=0;
        if (user) {
          // console.log("auth codes uid="+user.uid);
            if (!user.layout) { return }  // beim Anmelden kommen zwei Änderungen, aber nur einmal codes zählen
            (await this.afs.collection('users/'+user.uid+'/codes').ref.where('used', '==', false).get()).forEach(doc => {
                let code = doc.data();
                // console.log("doc: ", code);
                codes.count++;
                if (code.wert == 18) codes.count18++;
                if (code.wert == 21) codes.count21++;
                if (code.wert == 26) codes.count26++;
            });
            console.log("auth codes "+codes.count18);
          } else {
            console.log("auth codes nicht angemeldet");
          }
      })
      return codes;
  }
  
  updateUserData(user, username: string, userpw: string) {
        // console.log("updateUserData");
        if (!user) { return; }
        // console.log("updateUserData: "+`users/${user.uid} `+username+", "+userpw, user);
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    
        let data = <User>{ 
          uid: user.uid, 
          email: user.email, 
          displayName: user.displayName, 
        };

        if (username && userpw) {
          data.tkluser = username;
          data.tklpw = userpw;
        }
    
        return userRef.set(data, { merge: true });
  }

  // Sign out 
  async signOut() {
    await this.afAuth.auth.signOut();
    // localStorage.removeItem('user');
    // this.router.navigate(['sign-in']);
  }

}