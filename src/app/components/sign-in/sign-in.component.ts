import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import {FormBuilder, FormControl } from '@angular/forms';
// import { AuthService } from "./services/auth.service";
import { AuthService } from "../../services/auth.service";
import { EventService } from '../../event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  layout: string;
  codes: any;
  loginname: string;
  loginpw: string;
  // autoReload: boolean;

  constructor(
    public _eventServer: EventService,
    public auth: AuthService,
    // public dialogRef: MatDialogRef<SignInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.codes = this.auth.codes();
    // console.log("layout="+data.layout);
    this.auth.afAuth.authState.subscribe(this.firebaseAuthChangeListener);
  }

  // async codes() {
  //   console.log("show codes");
  //   let codes = this.auth.codes();
  //   console.log("codes="+codes);
  // }

  private firebaseAuthChangeListener(response) {
    // if needed, do a redirect in here
    if (response) {
      let pref = localStorage.getItem('TKL-Halle-Login');
      let o;
      if (pref) {
        o = JSON.parse(pref);
        // console.log("login pref=", o);
      }
      if (!o) { o = {name: "", pw: ""} }
      console.log('firebaseAuthChangeListener Logged in with '+o.name+', '+o.pw+' :) ', response.user);
  
      if (this.auth) {
        this.auth.updateUserData(response.user, o.name, o.pw);
      }
    } else {
      console.log('firebaseAuthChangeListener Logged out :(');
    }
  }

  async login1(user:string, pw:string) {
    console.log("login1");
    localStorage.setItem('TKL-Halle-Login', JSON.stringify({
      name: user,
      pw: pw
    }));
    return this.login(user, pw);
  }

  async login(user:string, pw:string) {
    if (typeof user === 'undefined' || typeof pw === 'undefined') {
      let u;
      await this.auth.user$.subscribe( (v) => {u = v; });
      if (u) {
        // console.log("login ohne u/p uid=", u.uid);
        // return this.afs.doc<User>(`users/${user.uid}`).valueChanges();

      } else {
        // console.log("login ohne un/pw");
        return;
      }
    }
    this._eventServer.login(user, pw).subscribe(
      data => {
        this._eventServer.isAdmin = true;
        console.log("login success!", data);
        // console.log("olduid="+this.old)
        // this.refresh();
      },
      error => {
        this._eventServer.isAdmin = false;
        console.log("login error!", error);
        // this._snackBar.open("Fehler beim Speichern: "+error.error.text, "Ok");
      },
    );

  }

  successCallback(event) {
    console.log("successCallback "+this.loginname+", "+this.loginpw, event);
    // let uid = event.uid;
    let pref = localStorage.getItem('TKL-Halle-Login');
    let o;
    if (pref) {
      o = JSON.parse(pref);
      console.log("login pref=", o);
    }
    if (o) {
      console.log('pref '+o.name+', '+o.pw+' :) ');
      if (o.name.length < 2) { o.name = "" }
      if (o.pw.length < 2) { o.pw = "" }
    } else { o = {name: "", pw: ""} }

    return this.auth.updateUserData(event.authResult.user, o.name, o.pw);
  }

  errorCallback(event) {
    console.log("errorCallback ", event);
  }

  // onChangeAutoReload(newReload: boolean) {
  //   console.log("reload changed ", newReload);
  // }

  onChangeLayout(newLayout:string) {
    console.log("onChangeLayout() "+newLayout);
    // this.auth.user$.subscribe( user => {
    //   console.log("onChangeLayout() uid="+user.uid);
    //   if (user.layout !== newLayout) {
    //     this.auth.changeUserCfg(user.uid, newLayout);
    //   }
    // });
    localStorage.setItem('TKL-Halle-Layout', JSON.stringify({
      layout: newLayout,
    }));
  }

  ngOnInit() {
    let pref = localStorage.getItem('TKL-Halle-Layout');
    let o: any;
    if (pref) {
      o = JSON.parse(pref);
      // console.log("refresh layout=", o);
      this.layout = o.layout;
    }

    pref = localStorage.getItem('TKL-Halle-Login');
    if (pref) {
      o = JSON.parse(pref);
      // console.log("refresh login pref=", o);
      this.loginname = o.name;
      this.loginpw = o.pw;
    }
  }

}
