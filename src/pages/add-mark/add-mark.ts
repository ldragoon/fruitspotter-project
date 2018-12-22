// https://gist.github.com/grapevines/6204446
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-add-mark',
  templateUrl: 'add-mark.html'
})
export class AddMarkPage {
	public coords: any;
	public error: any;

	// Form values required for editing marks
	public id: number = 0;
	public fruit: string;
	public type: string;
	public lat: any;
	public lng: any;
	public desc: string;
	public reminder: boolean = false;
	public ripestart: string = new Date().toISOString();
	public ripeend: string = new Date().toISOString();
	public favorite: boolean = false;
	//public share: boolean = false;
	public timeStamp: string = new Date().toISOString();
	public updateTS: string = new Date().toISOString();

  marksRef: any;
	marks: Observable<Mark[]>;
  mark = {
		id: 0,
		fruit: '',
		type: '',
		desc: '',
		lat: '',
		lng: '',
		reminder: false,
		ripestart: '',
		ripeend: '',
		favorite: false,
		createdTS: this.timeStamp,
		updateTS: this.updateTS
	}

	// Notifications related variables
	/*
  notifyTime: any;
	notifications: any[];
	days: any[];
	chosenHours: number;
	chosenMinutes: number;
  */

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public view: ViewController,
    public geolocation: Geolocation,
    private storage: Storage,
		private firebaseAuth: AngularFireAuth,
    public firebaseDB: AngularFireDatabase,
    public alertCtrl: AlertController
  ) { }

	ionViewDidLoad() {
    console.log('ionViewDidLoad AddMarkPage');

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.marksRef = this.firebaseDB.list('users/' + user.uid + '/marks');
        this.marks = this.firebaseDB.list('users/' + user.uid + '/marks', ref => ref.orderByChild('type')).valueChanges();
      }
    });

		// Parameters attached to each record
		if(this.navParams.get('key')){
			this.mark.id 		= this.navParams.get('key');
	    this.mark.fruit = this.navParams.get('fruit');
	    this.mark.type 	= this.navParams.get('type');
	    this.mark.desc 	= this.navParams.get('desc');
			this.mark.lat 	= this.navParams.get('lat');
			this.mark.lng 	= this.navParams.get('lng');
			this.mark.reminder = this.navParams.get('reminder');
			this.mark.ripestart = this.navParams.get('ripestart');
			this.mark.ripeend 	= this.navParams.get('ripeend');
			this.mark.favorite	= this.navParams.get('favorite');
			//this.mark.share 		= this.navParams.get('share');
			this.mark.createdTS	= this.navParams.get('createdTS');

		} else if (this.navParams.get('map') === true) {
			console.log("Coordinates coming over from the map");

			this.mark.lat = this.navParams.get('lat');
			this.mark.lng = this.navParams.get('lng');

			console.log("from map latLng: ", this.mark.lat + ', ' + this.mark.lng);

		} else {
			console.log("Brand new record");

			// Gather current location
			this.geolocation.getCurrentPosition().then((position) => {
				this.lat = position.coords.latitude;
				this.lng = position.coords.longitude;

				this.mark.lat = this.lat;
				this.mark.lng = this.lng;

				console.log("get coords on page load: ", this.mark.lat + ',' + this.mark.lng);
				console.log("Top mark: ", this.mark);
			});
		}

		// Related to LocalNotifications
		/*
    this.notifyTime = moment(new Date()).format();
		this.chosenHours = new Date().getHours();
		this.chosenMinutes = new Date().getMinutes();

    this.days = [
        {title: 'Monday', dayCode: 1, checked: false},
        {title: 'Tuesday', dayCode: 2, checked: false},
        {title: 'Wednesday', dayCode: 3, checked: false},
        {title: 'Thursday', dayCode: 4, checked: false},
        {title: 'Friday', dayCode: 5, checked: false},
        {title: 'Saturday', dayCode: 6, checked: false},
        {title: 'Sunday', dayCode: 0, checked: false}
    ];
    */
  }

	updateLocation() {
		console.log("clicked get location");
		this.geolocation.getCurrentPosition().then((position) => {
			this.lat = position.coords.latitude;
			this.lng = position.coords.longitude;

			this.mark.lat = this.lat;
			this.mark.lng = this.lng;

			console.log("Updated coords: " + this.mark.lat + ', ' + this.mark.lng);
		});
	}

	addMark(mark, event) {
		console.log("Save me yay :D ",  mark);

		// check to see if they want to share it then save to:
		//this.af.database.list('acc_' + this.currentUser.uid + '/shared').push(mark);

		if(mark.id){
			console.log("Existing Mark id: " + mark.id);

      this.marksRef.update(mark.id, mark).then(mark => {
        this.navCtrl.pop();
      }).catch(error => { console.log("Error: ", error) });

    } else {
			console.log("Brand New Mark: ", mark);

      if(!mark.fruit){
				let alert = this.alertCtrl.create({
					title: "Can't add mark",
					subTitle: 'Please add a fruit',
					message: 'Try again!',
					buttons: [
						{
							text: 'Cancel',
							role: 'cancel',
							handler: () => {
								console.log("Cancel clicked");
							}
						}
					]
				});
				alert.present();

			} else {

        this.marksRef.push(mark).then(() => {
					this.navCtrl.pop();
	      }, error => {
	        console.log(error);
	      });

			}
    }

  }

	// Functions related to LocalNotifications
	/*
  timeChange(time){
		this.chosenHours = time.hour.value;
		this.chosenMinutes = time.minute.value;
	}

  addNotifications() {
		let currentDate = new Date();
		let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

		for(let day of this.days){

			if(day.checked){

				let firstNotificationTime = new Date();
				let dayDifference = day.dayCode - currentDay;

				if(dayDifference < 0){
					dayDifference = dayDifference + 7; // for cases where the day is in the following week
				}

				firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
				firstNotificationTime.setHours(this.chosenHours);
				firstNotificationTime.setMinutes(this.chosenMinutes);

				let notification = {
					id: day.dayCode,
					title: 'Hey!',
					text: 'You just got notified :)',
					at: firstNotificationTime,
					every: 'week'
				};

				this.notifications.push(notification);

			}
		}

		console.log("Notifications to be scheduled: ", this.notifications);

		if(this.platform.is('cordova')){

			// Cancel any existing notifications
      LocalNotifications.cancelAll().then(() => {

				// Schedule the new notifications
				LocalNotifications.schedule(this.notifications);

				this.notifications = [];

				let alert = this.alertCtrl.create({
					title: 'Notifications set',
					buttons: ['Ok']
				});

				alert.present();

			});
    }
	}

	cancelAll() {
		//LocalNotifications.cancelAll();

		let alert = this.alertCtrl.create({
			title: 'Notifications cancelled',
			buttons: ['Ok']
		});

		alert.present();
	}
  */

	close(){
    this.view.dismiss();
  }

}
