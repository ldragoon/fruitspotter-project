import { Injectable } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';

@Injectable()
export class MockProvider {

  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController
  ) {
    console.log("Mockdata provider");
  }

}
