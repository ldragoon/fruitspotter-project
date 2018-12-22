import { } from 'jasmine';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Rx';

declare var Promise: any;

export class PlatformMock {
  public ready(): Promise<string> {

    return new Promise((resolve) => {
      resolve('READY');
    });

  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return ;
  }

}

export class DeepLinkerMock {

}

export class StorageMock {
  public static instance(key:any = 'key1', value: any = 'value1'): any {

    let instance = jasmine.createSpyObj('Storage', [
      'driver',
      'ready',
      'get',
      'set',
      'remove',
      'clear',
      'length',
      'keys',
      'forEach'
    ]);

    instance['driver'] = '';

    instance.ready.and.returnValue(Promise.resolve({}));
    instance.set.and.returnValue(Promise.resolve());
    instance.get.and.returnValue(Promise.resolve(value));
    instance.remove.and.returnValue(Promise.resolve());
    instance.clear.and.returnValue(Promise.resolve());
    instance.length.and.returnValue(Promise.resolve(1));
    instance.keys.and.returnValue(Promise.resolve([key]));
    instance.forEach.and.returnValue(Promise.resolve());

    return instance;
  }
}

export class AuthProviderMock {

  public getAuthState(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

}
