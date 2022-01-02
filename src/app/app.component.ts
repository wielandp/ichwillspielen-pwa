import { Component, OnInit } from '@angular/core';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from './event.service';
import { AuthService } from './services/auth.service';

// import { Observable, of as observableOf} from 'rxjs';
// import { isDefined } from '@angular/compiler/src/util';

//declare var paypal;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TKL Halle';

  constructor(
    public _eventServer: EventService,
    private _snackBar: MatSnackBar,
    public auth: AuthService,
    public dialog: MatDialog,
  ) {
  }

  // swipe(dir: number) {
  //   console.log("swipe "+dir);
  //   if (dir < 0) { this.onPrev(); }
  //   else { this.onNext(); }
  // }

  ngOnInit() {
    // login with false cretentials, to make sure old session admin is gone
    this._eventServer.login("", "").subscribe(
      data => {
        this._eventServer.isAdmin = true;
        console.log("login success!", data);
        // this.refresh();
      },
      error => {
        this._eventServer.isAdmin = false;
        console.log("login error!", error);
        // this._snackBar.open("Fehler beim Speichern: "+error.error.text, "Ok");
      },
    );

    // doc.ref.get().then(doc => {
    //   console.log('Got document!');
    //   if (!doc.exists) {
    //     console.log('No such document!');
    //   } else {
    //     data = doc.data();
    //     console.log('Document data:', data);
    //   }
    // });
    // console.log("doc=");

    this.auth.user$.subscribe( user => {
      // console.log("ngOnInit user=", user);
      if (user) {
        // console.log("ngOnInit user.uid=", user.uid);
        if (this._eventServer.oldUid !== user.uid) {          
          // console.log("ngOnInit auth name="+user.displayName+" email="+user.email);
          this._snackBar.open("Angemeldet als "+user.email, undefined, {duration: 1000});
          this._eventServer.oldUid = user.uid;
          this._eventServer.oldEMail = user.email;
        }
      } else {
        // console.log("ngOnInit auth nicht angemeldet");
        this._eventServer.oldUid = "";
        this._eventServer.oldEMail = "";
      }
      let pref = localStorage.getItem('TKL-Halle-Pref');
      let o: any;
      if (pref) {
        o = JSON.parse(pref);
      }
      if (!o) { o = {firstname: "", lastname: ""}; }
      this.auth.log_version(this._eventServer.version, this._eventServer.oldUid, this._eventServer.oldEMail, o.firstname, o.lastname);
    });
  }
}