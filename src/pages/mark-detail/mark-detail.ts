import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { MyMarksPage } from '../my-marks/my-marks';
import { AddMarkPage } from '../add-mark/add-mark';

declare var google: any;

@Component({
  selector: 'page-mark-detail',
  templateUrl: 'mark-detail.html'
})
export class MarkDetailPage {
	private currentUser: any;
	public staticMapUrl: string;
	public distance: any;
	public geoaddress: any = [];

  private markRef: AngularFireList<any>;
	public mark: any;
	public key: string;
  public fruit: string;
  public type: string;
  public desc: string;
  public lat: number;
  public lng: number;
  public reminder: boolean = false;
  public ripeend: Date;
  public ripestart: Date;
  //public share: boolean = false;
	//public friends: any[];
	public favorite: boolean = false;
  public createdTS: Date;

	private start: number[];
	private destination: number[];

  constructor(
    public alertCtrl: AlertController,
		public navCtrl: NavController,
		public navParams: NavParams,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public loader: MapsAPILoader,
    private storage: Storage,
    private launchnav: LaunchNavigator,
		public firebaseAuth: AngularFireAuth,
		public firebaseDB: AngularFireDatabase,
	) {
		this.geolocation.watchPosition().subscribe((pos) => {
			this.start = [pos.coords.latitude, pos.coords.longitude];
		});
	}

  ionViewDidLoad() {
		console.log('ionViewDidLoad MarkDetailPage');

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.markRef = this.firebaseDB.list('users/' + user.uid + '/marks');
      }
    });

    if (typeof this.navParams.get('mark') != 'undefined') {
      this.mark = this.navParams.get('mark');
  		this.key = this.navParams.get('mark').key;
      this.fruit = this.navParams.get('mark').fruit;
      this.type = this.navParams.get('mark').type;
      this.desc = this.navParams.get('mark').desc;
      this.lat = this.navParams.get('mark').lat;
      this.lng = this.navParams.get('mark').lng;
      this.reminder = this.navParams.get('mark').reminder;
      this.ripeend = this.navParams.get('mark').ripeend;
      this.ripestart = this.navParams.get('mark').ripestart;
      //this.share = this.navParams.get('mark').share;
  		//this.friends = this.navParams.get('mark').friends;
  		this.favorite = this.navParams.get('mark').favorite;
  		this.createdTS = this.navParams.get('mark').createdTS;
    }

    this.staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=%22" + this.lat + "," + this.lng + "%22&size=640x400&style=element:labels|visibility:off&style=element:geometry.stroke|visibility:off&style=feature:landscape|element:geometry|saturation:-100&style=feature:water|saturation:-100|invert_lightness:true&key=AIzaSyDjt8_7B3mRclxUAfHRC0rY5_tWjFXyPPc";
		this.getLocation(this.lat, this.lng);
		this.destination = [this.lat, this.lng];

		this.applyHaversine();
  }

	navigate(){
    let options: LaunchNavigatorOptions = {
			start: this.start
		};

		this.launchnav.navigate(this.destination, options)
		.then(
			success => console.log('Launched Navigator'),
			error => alert('Error launching navigator: ' + error)
		);
	}

	markFavorite(){
		console.log("this.key: ", this.key);

		if(this.favorite === true) {
			this.favorite = false;
		} else {
			this.favorite = true;
		}

    this.markRef.update(this.key, {
			favorite: this.favorite
		});
	}

	/*
  setReminder(){
		console.log("Set Reminder");
		console.log("this.key: ", this.key);

		if(this.reminder === true){
			console.log("this.reminder: " + true);
			this.reminder = false;
		} else {
			console.log("this.reminder: " + false);
			this.reminder = true;
		}

		console.log("this.reminder: " + this.reminder);

		// update the firebase item
    this.marks.update(this.key, {
			reminder: this.reminder
		});
	}
  */

	edit(){
    this.navCtrl.push(AddMarkPage, {
      key: this.key,
      fruit: this.fruit,
      type: this.type,
      desc: this.desc,
			lat: this.lat,
			lng: this.lng,
			reminder: this.reminder,
			ripestart: this.ripestart,
			ripeend: this.ripeend,
			favorite: this.favorite,
			createdTS: this.createdTS
			//share: this.share,
			//friends: this.friends
    });
  }

	delete() {
		console.log("deleteMark key: " + this.key);

    let prompt = this.alertCtrl.create({
      title: 'Delete Mark',
      message: "Are you sure you want to delete this mark?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log("Cancel clicked.");
          }
        },
        {
          text: "I'm sure!",
          handler: data => {
						console.log("Confirmation clicked.");

            this.markRef.remove(this.key).then(response => {
              console.log("This mark has been deleted: ", response);
              this.navCtrl.pop();
            });
          }
        }
      ]
    });

    prompt.present();
	}

	getLocation(lat: any, lng: any){
		console.log("lat & lng: ", lat + ' ' + lng);

    this.loader.load().then(() => {
			console.log('google script loaded');

			let latlng = new google.maps.LatLng(lat, lng);
			let geocoder = new google.maps.Geocoder();

			geocoder.geocode({'latLng': latlng}, (result, status) => {
				console.log("status: ", status);

				if (status === google.maps.GeocoderStatus.OK) {

					console.log("results: ", result);

					this.geoaddress = [{
						address: result[1].formatted_address,
						address_components: result[1].address_components
					}];

					console.log("Geoaddress: ", this.geoaddress);
					console.log("Address: ", this.geoaddress[0].address);

					return this.geoaddress;

				} else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
					console.log("Zero results for geocoding latlng");
				} else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
					console.log("Over query limit");
				} else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
					console.log("Request denied for geocoding latlng");
				} else if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
					console.log("Invalid request for geocoding latlng");
				}
			});
		});

	}

	applyHaversine(){
		let watch = this.geolocation.watchPosition();

		watch.subscribe((position) => {
			let usersLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			let placeLocation = {
				lat: this.lat,
				lng: this.lng
			};

			this.distance = this.getDistanceBetweenPoints(
				usersLocation,
				placeLocation,
				'miles'
			).toFixed(2);

			return this.distance;
		});
	}

	getDistanceBetweenPoints(start, end, units){
		let earthRadius = {
			miles: 3958.8,
			km: 6371
		}

		let R = earthRadius[units || 'miles'];
		let lat1 = start.lat;
		let lng1 = start.lng;
		let lat2 = end.lat;
		let lng2 = end.lng;

		let dLat = this.toRad((lat2 - lat1));
		let dLng = this.toRad((lng2 - lng1));
		let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		let d = R * c;

		return d;
	}

	toRad(x){
		return x * Math.PI / 180;
	}

}
