import {} from 'jasmine';

import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

import { AuthProvider } from '../providers/auth/auth';

import { MyApp } from './app.component';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock,
  StorageMock,
  AuthProviderMock
} from '../../test-config/mocks-ionic';

describe('MyApp', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        IonicModule.forRoot(MyApp)
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Storage, useClass: StorageMock },
        { provide: AuthProvider, useClass: AuthProviderMock }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });

  it('should have a rootPage of LoginPage', () => {
    expect(component.rootPage).toBe('LoginPage');
  });

  it('should have four loggedInPages', () => {
    expect(component.loggedInPages.length).toBe(4);
  });

  it('should have three loggedOutPages', () => {
    expect(component.loggedOutPages.length).toBe(3);
  });
});
