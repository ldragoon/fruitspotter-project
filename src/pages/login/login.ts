import { Component } from '@angular/core';
import { NgForm, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';

import { EmailValidator } from '../../validators/email.validator';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  validations_form: FormGroup;
  emailMask = EmailValidator;

  login: any = { email: '', password: ''};
  submitted: boolean = false;
  loading: any;

  constructor(
    private firebaseAuth: AngularFireAuth,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
		if(this.navParams.get('logout') === true) {
			this.logoutUser();
		}
  }

  ionViewWillLoad() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

	logoutUser() {
    this.firebaseAuth.auth.signOut();
	}

  onLogin(form: NgForm){
    this.submitted = true;
    console.log("click");

    if(form.valid){
      this.firebaseAuth.auth.signInWithEmailAndPassword(form.value.email, form.value.password).then(value => {
        this.navCtrl.setRoot(HomePage);
      })
      .catch(error => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: "Ok", role: 'cancel' }]
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

  goToResetPassword(){
    this.navCtrl.push(ResetPasswordPage);
  }

  createAccount(){
    this.navCtrl.push(SignupPage);
  }

	ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
}
