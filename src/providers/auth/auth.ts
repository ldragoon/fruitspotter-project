import { Injectable } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {
  public user: Observable<firebase.User>;

  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    public firebaseAuth: AngularFireAuth
  ) {
    this.user = firebaseAuth.authState;
  }

  getAuthState(): Observable<firebase.User> {
    return this.firebaseAuth.authState;
  }

  logout(): Promise<any> { 
    return new Promise((resolve, reject) => { 
      firebase.auth().signOut().then(() => {
        resolve();
      }, (error) => {
        reject(error);
       });
    });
  }

}
