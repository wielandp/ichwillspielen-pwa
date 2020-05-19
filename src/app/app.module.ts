import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from "@angular/forms";
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from "./material/material.module";
import { EventService } from "./event.service";
import { environment } from '../environments/environment';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
import { DatePipe } from '@angular/common';
 
// import { //HammerGestureConfig, 
//         HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
// import { MyHammerConfig } from "./my-hammer.config";
import { AngularFireModule } from '@angular/fire';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreModule //, AngularFirestoreDocument 
} from '@angular/fire/firestore';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthService } from "./services/auth.service";

// import {FirebaseUIModule} from 'firebaseui-angular';
// import * as firebase from 'firebase/app';
// import * as firebaseui from 'firebaseui';
// currently there is a bug while building the app with --prod
// - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// the plugin exposes the two libraries as well. You can use those:
import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DayCalComponent } from './day-cal/day-cal.component';
import { CodesListComponent } from './codes-list/codes-list.component';
import { UpdateComponent } from './update/update.component';
// import { MytransListComponent } from './mytrans-list/mytrans-list.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // signInMethod: "emailLink",
      // signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      // forceSameDevice: true,
      // emailLinkSignIn() {
      //   return {
      //     url: `https://tklhalle.de/login`,
      //     handleCodeInApp: true
      //   };
      // },
    },
  ],
  tosUrl: 'https://tklhalle.de/tos',
  privacyPolicyUrl: 'https://tklhalle.de/privacy',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};

// // create a class that overrides hammer default config
// @Injectable()
// export class MyHammerConfig extends HammerGestureConfig  {
//   overrides = <any>{
//     'pinch': { enable: false },
//     'rotate': { enable: false }
//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    DialogEditComponent,
    SignInComponent,
    routingComponents,
    PageNotFoundComponent,
    DayCalComponent,
    CodesListComponent,
    UpdateComponent,
  ],
  entryComponents: [
    DialogEditComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFireDatabaseModule,
    AngularFireAuthModule,
    // AngularFirestore, 
    AngularFirestoreModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    // AngularFireStorageModule,
    // AngularFirestoreDocument,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthService,
    // AngularFirestore, 
    // AngularFirestoreDocument, 
    EventService, 
    // { 
    //   provide: HAMMER_GESTURE_CONFIG, 
    //   useClass: MyHammerConfig 
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
