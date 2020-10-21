import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { DataService } from '../pages/services/DataService';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html',
  providers: [DataService]
})

export class MyApp {

  rootPage:any; // = WelcomePage;
  public config_url:string = '';

  constructor (
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public http: Http,
    public storage: Storage,
    public dataService: DataService
    ) {

      // LOAD INTERNAL STORAGE
      this.storage.get('userData').then((data) => {

        this.rootPage = WelcomePage;

        if (data) {
          if (data.setup && data.personal && data.contact && data.optional) {
            dataService.flashUserData(data);
            this.rootPage = HomePage;
          }
        }

        let userData = dataService.getUserData();
        translate.setDefaultLang(userData.language);
        translate.use(userData.language);

        this.platformReady();
      });

    this.http.get(dataService.getConfig('data_url') + '?nocache=' + Math.random()).map(res => res.json()).subscribe(data => {
      if (data.whatsapp) { // VALIDATE --> WHATSAPP DATA SET
        dataService.setAppData(data);
      }
    });
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
