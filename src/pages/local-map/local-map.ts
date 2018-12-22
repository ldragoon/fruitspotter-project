import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Storage } from '@ionic/storage';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { AddMarkPage } from '../add-mark/add-mark';

import { Observable } from 'rxjs/Observable';

declare var google: any;

@Component({
  selector: 'page-local-map',
  templateUrl: 'local-map.html'
})
export class LocalMapPage {
  public map: any;
	public tempMark = [];
	public marks: Observable<any>;
	public lat: number;
	public lng: number;
	public label: string = "My Location";
	public zoom: number = 15;
	public draggable: boolean = true;
	public isDisplayOfflineMode: boolean = false;
	public myIcon: any;

  constructor(
    public navCtrl: NavController,
		public navParams: NavParams,
		public loader: MapsAPILoader,
    private storage: Storage,
		public alertCtrl: AlertController,
		private firebaseAuth: AngularFireAuth,
    public firebaseDB: AngularFireDatabase,
    public geolocation: Geolocation
	 ){
		this.map = {};
		this.tempMark = [];

		this.myIcon = {
			url: "assets/icon/icon-location.png",
			scaledSize: {
				height: 30,
				width: 30
			}
		}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.marks = this.firebaseDB.list('users/' + user.uid + '/marks', ref => ref.orderByChild('fruit')).valueChanges();
      }
    });

		this.loadMap();
		this.autoComplete();
  }
	loadMap(){
		console.log("loadMap()");
		this.geolocation.getCurrentPosition().then((position) => {
			console.log("this.marks: ", this.marks);

			// This just recenters the map on these default coordinates
			this.map = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
				zoom: this.zoom,
				label: this.label,
				draggable: this.draggable
			};

			console.log("this.map: ", this.map);

			// Initial starting point mark
			this.tempMark.push({
					"lat": position.coords.latitude,
					"lng": position.coords.longitude,
					"label": "My current position",
					"start": true
				});
		}, (err) => {
      console.log("Error: ", err);
    }).catch((error) => { console.log("Catch Map Error: ", error) });
	}

	mapClicked($event){
		// Clear the previous marker from the map
		this.tempMark = [];

		// Refill it from the $event
		console.log("Map Clicked: ", $event);

		this.tempMark.push({
			lat: $event.coords.lat,
			lng: $event.coords.lng
		});
	}

	clickedMarker(label: string, index: number){
		console.log("Clicked the Marker" + label + ' ' + index);
	}

	markerDragEnd($event){
		console.log('dragEnd', $event.coords.lat + ', ' + $event.coords.lng);
		this.tempMark = [{
			lat: $event.coords.lat,
			lng: $event.coords.lng,
			label: "My current location",
			start: true
		}];

		console.log("this.tempMark: ", this.tempMark);
	}

	addMark(ev: any){
		console.log("addMark Event: ", ev);
		console.log("addMark tempMark: " + this.tempMark[0].lat + ', ' + this.tempMark[0].lng);

		// Check to make sure they've clicked on the map to add a marker
		if(this.tempMark.length > 0) {
      this.navCtrl.push(AddMarkPage, {
				map: true,
	      lat: this.tempMark[0].lat,
				lng: this.tempMark[0].lng
	    });

		} else {
			// if they haven't show an alert
			let alert = this.alertCtrl.create({
				title: 'No position chosen',
				subTitle: "You didn't click the map!",
				message: "Click the map to add a mark",
				buttons: ['Dismiss']
			});
			alert.present();
		}
	}

	autoComplete() {
    this.loader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete( document.getElementById('autocomplete').getElementsByTagName('input')[0], {});

			google.maps.event.addListener(autocomplete, 'place_changed', () => {
				let place = autocomplete.getPlace();

				this.map.lat  = place.geometry.location.lat();
				this.map.lng = place.geometry.location.lng();

				console.log(place);
			});
		});
	}

}
