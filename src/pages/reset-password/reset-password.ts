import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, AlertController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {
  resetpassword: any = { email: '' };
  submitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public firebaseAuth: AngularFireAuth
  ) { }
  resetPassword(form: NgForm){
    this.submitted = true;

    if(!form.valid) {
      console.log("not valid");
      console.log(form.value);
    } else {
      console.log("valid");
      console.log(form.value);
      this.firebaseAuth.auth.sendPasswordResetEmail(form.value).then(() => {
        let alert = this.alertCtrl.create({
          message: "We just sent a reset link to your email",
          buttons: [{
            text: "OK",
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
              this.navCtrl.push(LoginPage);
            }
          }]
        });

        alert.present();
      }, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [{
            text: "OK",
            role: 'cancel'
          }]
        });

        errorAlert.present();
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}
