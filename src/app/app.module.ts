import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Import for Angular2-Moment
// docs: https://github.com/urish/angular2-moment
import { MomentModule } from 'angular2-moment';

// Import for Angular2 Google Maps
// docs: https://angular-maps.com/docs/getting-started.html
import { AgmCoreModule, MapsAPILoader } from '@agm/core';

import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LogoutPopoverPage } from '../pages/logout-popover/logout-popover';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import { MyMarksPage } from '../pages/my-marks/my-marks';
import { MarkDetailPage } from '../pages/mark-detail/mark-detail';
import { LocalMapPage } from '../pages/local-map/local-map';
import { AddMarkPage } from '../pages/add-mark/add-mark';
//import { AddFriendPage } from '../pages/add-friend/add-friend';

import { EmailValidator } from '../validators/email.validator';

import { AuthProvider } from "../providers/auth/auth";
import { MockProvider } from '../providers/mock/mock';
import { MarksProvider } from '../providers/marks/marks';
import { UserProfileProvider } from '../providers/user-profile/user-profile';

export const environment = {
    production: false,
    firebase: {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: ""
    }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LogoutPopoverPage,
    ResetPasswordPage,
    SignupPage,
    MyMarksPage,
    MarkDetailPage,
		LocalMapPage,
    AddMarkPage
		//AddFriendPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: HomePage, name: 'HomePage', segment: 'home' },
        { component: ResetPasswordPage, name: 'ResetPasswordPage', segment: 'reset-password' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: MyMarksPage, name: 'MyMarksPage', segment: 'my-marks' },
        { component: MarkDetailPage, name: 'MarkDetailPage', segment: 'mark-detail' },
        { component: LocalMapPage, name: 'LocalMapPage', segment: 'local-map' },
        { component: AddMarkPage, name: 'AddMarkPage', segment: 'add-mark' }
      ]
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MomentModule,
    IonicStorageModule.forRoot(),
		AgmCoreModule.forRoot({
			apiKey: '',
			libraries: ['places']
		})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    LogoutPopoverPage,
    ResetPasswordPage,
    SignupPage,
    MyMarksPage,
    MarkDetailPage,
		LocalMapPage,
    AddMarkPage
		//AddFriendPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
		//MarksData,
		//UserData,
    AgmCoreModule,
		EmailValidator,
    Geolocation,
    NativeGeocoder,
    InAppBrowser,
    LaunchNavigator,
    SplashScreen,
    MockProvider,
    MarksProvider,
    UserProfileProvider
  ]
})
export class AppModule {}
