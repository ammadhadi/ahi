import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/DataService';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SetupPersonalPage } from '../setup-personal/setup-personal';
//import { HomePage } from '../home/home';


//@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  public englishBtn: string = 'secondary';
  public frenchBtn: string = 'light';
  version:string;
  year:string;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    private dataService: DataService,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    private iab: InAppBrowser
    ) {
      this.version = this.dataService.getConfig('version');
      this.year = new Date().getFullYear().toString();

      if (this.dataService.getLanguage() == 'en') {
        this.englishBtn = 'secondary';
        this.frenchBtn = 'light';
      } else {
        this.englishBtn = 'light';
        this.frenchBtn = 'secondary';
      }
  }

  translateTo (language) {
    if (language == 'en') {
      this.englishBtn = 'secondary';
      this.frenchBtn = 'light';
    } else {
      this.englishBtn = 'light';
      this.frenchBtn = 'secondary';
    }

    this.dataService.setLanguage(language);
  }

  getStarted () {
    this.navCtrl.push(SetupPersonalPage);
  }

  openExternal (url) {
    this.iab.create(url, '_system');
  }

}
