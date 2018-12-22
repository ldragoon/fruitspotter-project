import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { HomePage } from '../home/home';

import { FormBuilderEmailValidator } from '../../validators/email';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private signupForm: FormGroup;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading;

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public firebaseAuth: AngularFireAuth
  ) {
    this.signupForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        FormBuilderEmailValidator.isValid,
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
  }

  /**
  * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
  */
  elementChanged(input){
    //let field = input.inputControl.name;
    //this[field + "Changed"] = true;
  }

  /**
  * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
  * component while the user waits.
  *
  * If the form is invalid it will just log the form value, feel free to handle that as you like.
  */
  signupUser(){
    this.submitAttempt = true;

    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password).then(() => {
        this.nav.setRoot(HomePage);
      }, (error) => {
        this.loading.dismiss().then(() => {
          var errorMessage: string = error.message;
          let alert = this.alertCtrl.create({
            message: errorMessage,
            buttons: [{ text: "Ok", role: 'cancel' } ]
          });

          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });

      this.loading.present();
    }
  }
}
