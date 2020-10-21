import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DataService } from '../services/DataService';
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HomePage } from '../home/home';

//@IonicPage()
@Component({
  selector: 'instructions',
  templateUrl: 'instructions.html',
})
export class InstructionsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public dataService: DataService,
    public iab: InAppBrowser
  ) {

    if (this.navParams.get('thankYou')) {

      this.alertCtrl.create({
        title: translate.instant('ALERT_THANKS'),
        subTitle: translate.instant('ALERT_THANKS_MSG'),
        buttons: [translate.instant('BTN_THANKS')]
      }).present();
    }
  }

  home(){
    this.navCtrl.setRoot( HomePage );
  }

  openExternal (url) {
    this.iab.create(url, '_system');
  }

}
