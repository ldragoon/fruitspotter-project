import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { MarkDetailPage } from '../mark-detail/mark-detail';
import { AddMarkPage } from '../add-mark/add-mark';

import { MarksProvider } from '../../providers/marks/marks';

import { Mark } from '../../model/mark';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'page-my-marks',
  templateUrl: 'my-marks.html'
})
export class MyMarksPage {
  private uid: string;
  private marksRef: any;
  public marks: Observable<Mark[]>;
  public mark = {} as Mark;
	public favorite: boolean = false;

  public filteredMarks: Array<string> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public alertCtrl: AlertController,
    private firebaseAuth: AngularFireAuth,
    public firebaseDB: AngularFireDatabase,
    public marksService: MarksProvider
  ) { }

  ionViewDidLoad() {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.marksRef = this.firebaseDB.list<Mark>('users/' + this.uid + '/marks');
        this.initializeMarks();
      }
    });

    this.marksService.load().subscribe((data) => {
      let markMocks = data.marks;
      console.log("markMocks:", markMocks);
    });
  }

  initializeMarks(): Observable<Mark[]> {
    return this.marks = this.marksRef.snapshotChanges().map(action => {
      return action.map(a => ({
        key: a.payload.key, ...a.payload.val()
      }));
    });
  }

  filterMarks(event: any) {
    console.log("Event: ", event);

    // reset the list
    this.initializeMarks();

    let _filteredMarks = [];
    let term = event.target.value;
    console.log("term: ", term.length, term);
    console.log("_filteredMarks: ", _filteredMarks);

    if(term.length === 0){
      this.onClear();
    }

    // if the value is an empty string don't filter the items
    if (term && term.trim() != '') {
      //this.marks = this.firebaseDB.list<Mark>('users/' + this.uid + '/marks', ref => ref.orderByChild('fruit').equalTo(term)).valueChanges();

      this.marksRef.snapshotChanges().map(action => {
        return action.map(a => ({
          key: a.payload.key, ...a.payload.val()
        }));
      })
      .subscribe(data => {
        data.forEach((value, key) => {
          if(value['fruit'].toLowerCase().includes(term.toLowerCase()) === true) {
            _filteredMarks.push(value);
          }
        });
        this.filteredMarks = _filteredMarks;
        console.log("this.filteredMarks: ", this.filteredMarks);
      });
    }
  }

  onCancel(){
		this.initializeMarks();
    this.filteredMarks = [];
	}

  onClear() {
    this.initializeMarks();
    this.filteredMarks = [];
  }

  view(mark: any){
    this.navCtrl.push(MarkDetailPage, {
      mark: mark
    });
  }

  add(){
		//this.navCtrl.pop();
		this.navCtrl.push(AddMarkPage);
  }

  edit(mark: any){
    this.navCtrl.push(AddMarkPage, {
      key: mark.id,
      fruit: mark.fruit,
      type: mark.type,
      desc: mark.desc,
			lat: mark.lat,
			lng: mark.lng,
			reminder: mark.reminder,
			ripestart: mark.ripestart,
			ripeend: mark.ripeend,
			favorite: mark.favorite,
			share: mark.share,
			createdTS: mark.createdTS
    });
  }

  delete(key: string) {
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
            this.marksRef.remove(key);
          }
        }
      ]
    });
    prompt.present();
  }

  markFavorite(key: string){
		if(this.favorite === true) {
			this.favorite = false;
		} else {
			this.favorite = true;
		}

		this.marksRef.update(key, {
			favorite: this.favorite
		})
	}
}
