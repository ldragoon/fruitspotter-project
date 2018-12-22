// https://github.com/sdey0081/ionic-messenger-starter
// https://www.joshmorony.com/getting-familiar-with-local-notifications-in-ionic-2/
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';

import { LogoutPopoverPage } from '../logout-popover/logout-popover';
import { MyMarksPage } from '../my-marks/my-marks';
import { LocalMapPage } from '../local-map/local-map';
import { AddMarkPage } from '../add-mark/add-mark';

/*
import { MarkDetailPage } from '../mark-detail/mark-detail';
import { AddFriendPage } from '../add-friend/add-friend';

import { AuthData } from '../../providers/auth-data';

import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/mergeMap';
*/

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser: any;

	/*
  marksRef: FirebaseListObservable<any>;
	friendsRef: FirebaseListObservable<any>;
	friendRequestList: FirebaseListObservable<any>;
  */

	sent: number = 0;
	groupedMarks: any[];
	myReminders: any[];
	testMarks: any;
	numberReminders: number = 0;

	today: any;
	lastMonth: any;
	nextMonth: any;

  //myMarks = MyMarksPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
		public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
		public firebaseAuth: AngularFireAuth
  ) {
    this.navCtrl = navCtrl;
    /*
    this.authData = authData;
    this.currentUser = this.authData.getCurrentUser();

		this.af.auth.distinct((x, y) => x.uid === y.uid)
		.flatMap(auth => {
			return this.af.database.list('users/' + auth.uid);
		})
		.subscribe((user) => {
			this.testMarks = user;

			let keys;
			user.forEach(data => {
				if(data.$key === "friends"){
					keys = Object.keys(data);
				}
			});
			console.log("this.testMarks keys: ", keys);
			console.log("this.testMarks: ", this.testMarks);
		}, (error) => { console.log("Error: ", error) });

		this.marksRef = this.af.database.list('users/' + this.currentUser.uid + '/marks');
		this.friendsRef = this.af.database.list('users/' + this.currentUser.uid + '/friends');

		let _today = new Date();
		this.today = _today.toISOString();

		let _lastMonth = new Date();
		_lastMonth.setMonth(_lastMonth.getMonth() - 1);
		this.lastMonth = _lastMonth.toISOString();

		let _nextMonth = new Date();
		_nextMonth.setMonth(_nextMonth.getMonth() + 1);
		this.nextMonth = _nextMonth.toISOString();

		this.friendRequestList = this.af.database.list('friend-requests', {
			query: {
				orderByChild: 'email',
				equalTo: this.currentUser.email
			}
		});

		this.getFriendList().subscribe(data => {
			if(data.length > 0) {
				this.checkFriendState(data);
			}
		});
    */
  }

	ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

		// Get their marks
		/*this.marksRef.subscribe(data => {
			this.myReminders = data;

			console.log("this.myReminders: ", this.myReminders);

			this.myReminders.forEach((reminder) => {
				if(reminder.reminder === true) {
					this.numberReminders += 1;
				}
			});
		}, (error) => { console.log("Error: ", error) });
    */

  }

  logOutPopover(myEvent){
    let popover = this.popoverCtrl.create(LogoutPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

	/*
  getFriendList(){
		return this.af.database.list('friend-requests', {
			query: {
				orderByChild: 'email',
				equalTo: this.currentUser.email
			}
		});
	}

	checkFriendState(record: any) {
		this.friendsRef.subscribe(response => {
			let tempBuilder = [];

			response.forEach(friend => {
				record.forEach(data => {
					if(data.sentFrom === friend.email) {
						tempBuilder.push({ linked: data.sentFrom });
					}
				});
			});

			this.sent = tempBuilder.length;
			console.log("this.sent: " + this.sent);
		});
	}

	viewMark(mark: any){
		this.navCtrl.push(MarkDetailPage, {
      mark: mark
    });
  }

	friends(event){
		console.log(event);
		this.navCtrl.push(AddFriendPage);
	}

	friendBack(event: any, email: string){
		console.log("Event: ", event);
		console.log("Email: " + email);
		this.af.database.list('users/' + this.currentUser.uid + '/friends').push({email: email});
		this.af.database.list('friend-requests/').push({
			email: email,
			sentFrom: this.currentUser.email
		});
	}

	// https://www.joshmorony.com/an-introduction-to-lists-in-ionic-2/
	// https://www.joshmorony.com/high-performance-list-filtering-in-ionic-2/
	getSnapshot(){
		let snap = [];

		this.snapshot.subscribe(snapshots => {
			snapshots.forEach((snapshot) => {
				let key = snapshot.key;
				let value = snapshot.val();

				//console.log("Key: ", key, " Value:", value);

				value.$key = key;

				snap.push(value);
			});

			console.log("snap: ", snap);

			//let reminders = snap;
			//let currentType = false;
			//let currentReminders = [];

			let sortedReminders = snap.sort();

			sortedReminders.forEach((value, index) => {
				// If reminder is set to true
				// 	AND
				// ripestart falls between NOW and LAST MONTH
				let today = new Date();
				let lastMonth = new Date();
				lastMonth.setMonth(lastMonth.getMonth() - 1);

				// Snag records with reminders set as true
				// AND
				// ripestarts LESS THAN OR EQUAL TO today's date
				// AND
				// records with ripestarts GREATER THAN OR EQUAL TO the past 30 days
				if(value.reminder === true && value.ripestart <= today.toISOString() && value.ripestart >= lastMonth.toISOString()) {
					//console.log(index, value);
					//console.log("Ripestart: ", value.ripestart);

					this.myReminders.push(value);
				}

			});

			console.log("this.myReminders: ", this.myReminders);

			// Grouping Stuff!!!!
			sortedReminders.forEach((value, index) => {
				console.log("currentType1: ", currentType);
				if(value.type != currentType) {
					currentType = value.type;
					console.log("currentType2: ", currentType);

					let newGroup = {
						type: currentType,
						marks: []
					}

					console.log("newGroup: ", newGroup);

					currentReminders = newGroup.marks;

					this.groupedMarks.push(newGroup);
				}

				currentReminders.push(value);
			});

			console.log("this.groupedMarks: ", this.groupedMarks);

		});
	}
  */

  add(event){
    this.navCtrl.push(AddMarkPage);
  }

  map(event){
		this.navCtrl.push(LocalMapPage);
  }

  myMarks(event){
    this.navCtrl.push(MyMarksPage);
  }
}
