import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

// Import Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import { MyMarksPage } from '../pages/my-marks/my-marks';
import { LocalMapPage } from '../pages/local-map/local-map';
import { AddMarkPage } from '../pages/add-mark/add-mark';

//import { AddFriendPage } from '../pages/add-friend/add-friend';

import { AuthProvider } from '../providers/auth/auth';

import { Observable } from 'rxjs/Observable';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class MyApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
	@ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  loggedInPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: HomePage, icon: 'home'},
    { title: 'Map', name: 'LocalMapPage', component: LocalMapPage, icon: 'map'},
    { title: 'My Marks', name: 'MyMarksPage', component: MyMarksPage, icon: 'information-circle'},
    { title: 'Add a Mark', name: 'AddMarkPage', component: AddMarkPage, icon: 'plus' }
  ];

  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' },
    { title: 'Reset Password', name: 'ResetPasswordPage', component: ResetPasswordPage, icon: 'help' }
  ];

  rootPage: any = 'LoginPage';

  constructor(

    public menu: MenuController,
		public platform: Platform,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public authProvider: AuthProvider
	) {
    this.platform.ready().then(() => {

      this.authProvider.getAuthState().map((state) => !!state).subscribe((authenticated) => {
        console.log("Authenticated: ", authenticated);
        if (authenticated) {
          this.rootPage = HomePage;
          this.menu.enable(true, 'loggedInPages');
        } else {
          this.rootPage = LoginPage;
          this.menu.enable(false, 'loggedOutMenu');
        }
      });

      this.authProvider.getAuthState().subscribe(user => {
        console.log("user: ", user);
        storage.set('email', user.email);
        storage.set('uid', user.uid);

        // load the conference data
        // confData.load();
      });
 

      this.splashScreen.hide();
    });
  }
  openPage(page: PageInterface) {    
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // Close the menu when clicking a link from the menu
    this.menu.close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  isActive(page: PageInterface) {
    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return ;
  }

}
