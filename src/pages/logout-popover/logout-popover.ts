import { Component } from '@angular/core';
import { NavController, PopoverController, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-logout-popover',
  templateUrl: 'logout-popover.html'
})
export class LogoutPopoverPage {

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public firebaseAuth: AngularFireAuth
  ) {
    this.navCtrl = navCtrl;
  }

  logoutUser() {
    this.firebaseAuth.auth.signOut().then(() => {
      this.viewCtrl.dismiss();
  		this.navCtrl.push(LoginPage, { logout: true });
    })
    .catch((error) => {
      console.log("error: ", error.message);
    });
  }
}
