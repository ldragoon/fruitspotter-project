import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class UserProfileProvider {

  private firedata = firebase.database().ref('/users');

  constructor(
    private firebaseAuth: AngularFireAuth
  ) { }
  
  getUserProfile(): Promise<any> { 
    var promise = new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((error) => {
        reject(error);
      });
    });

    return promise;
  }


}