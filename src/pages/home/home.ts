import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ActionSheetController } from 'ionic-angular';
import { DataService } from '../services/DataService';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { InstructionsPage } from '../instructions/instructions';
import { SettingsPage } from '../settings/settings';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  latitude:any = 'Not available';
  longitude:any = 'Not available';
  whatsapp:string;
  phone:string;
  satellite:string;
  version:string;
  year:string;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    private dataService: DataService,
    private iab: InAppBrowser
    ) {

      this.version = this.dataService.getConfig('version');
      this.platform = platform;

      let appData = dataService.getAppData();
      this.whatsapp = appData.whatsapp;
      this.phone = appData.phone;
      this.satellite = appData.satellite;

      this.latitude = dataService.getGeo('latitude');
      this.longitude = dataService.getGeo('longitude');

      this.year = new Date().getFullYear().toString();

      if (this.navParams.get('settingsUpdated')) {
        this.alertCtrl.create({
          title: translate.instant('ALERT_UPDATED'),
          subTitle: translate.instant('ALERT_UPDATED_MSG'),
          buttons: [translate.instant('BTN_THANKS')]
        }).present();
      }

      this.getLocation();
  }

  getLocation () {
    let options = {timeout: 10000, enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then((position) => {
      this.dataService.setGeo('latitude', position.coords.latitude.toPrecision(8));
      this.dataService.setGeo('longitude', position.coords.longitude.toPrecision(8));

      this.latitude = this.dataService.getGeo('latitude');
      this.longitude = this.dataService.getGeo('longitude');
    }, (err) => { // LOCATION NOT AVAILABLE

      this.dataService.setGeo('latitude', this.translate.instant('GEO_UNAVAILABLE'));
      this.dataService.setGeo('longitude', this.translate.instant('GEO_UNAVAILABLE'));

      this.latitude = this.dataService.getGeo('latitude');
      this.longitude = this.dataService.getGeo('longitude');

      this.alertCtrl.create({
        title: this.translate.instant('ALERT_GEOLOCATION'),
        message: this.translate.instant('ALERT_GEOLOCATION_MSG'),
        buttons: [
          {
            text: this.translate.instant('CANCEL'),
            handler: () => { }
          },
          {
            text: this.translate.instant('BTN_RETRY'),
            handler: () => {
              this.getLocation();
            }
          }
        ]
      }).present();
    });
  }

  openMenu () {
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translate.instant('INSTRUCTIONS'),
          role: 'destructive',
          handler: () => {
            this.navCtrl.setRoot(InstructionsPage);
          }
        },
        {
          text: this.translate.instant('SETTINGS'),
          role: 'destructive',
          handler: () => {
            this.navCtrl.setRoot(SettingsPage);
          }
        },
        {
          text: this.translate.instant('SUBSCRIPTION'),
          role: 'destructive',
          handler: () => {
            this.openExternal( this.dataService.getAppDataParam('subscription_url') );
          }
        }
      ]
    });
    actionSheet.present();
  }

  openExternal (url) {
    this.iab.create(url, '_system');
  }

  openWhatsApp () {
    let userData = this.dataService.getUserData();
    let url = this.dataService.config['whatsapp_url'];
    url += 'EASA Help Request\n\n';
      url += 'From: ' + userData.personal.firstName + ' ' + userData.personal.lastName + '\n';
      url += 'A ' + userData.personal.age + '-year-old ';
      url += (userData.language == 'en') ? 'English speaking ' : 'French speaking ';
      url += userData.personal.sex + ' weighing ' + userData.personal.weight + 'kg at ' + userData.personal.height + 'cm tall.\n\n';

      url += 'Current Location:\n';
      url += 'Latitude: ' + this.dataService.getGeo('latitude') + '\n';
      url += 'Longitude: ' + this.dataService.getGeo('longitude') + '\n\n';

      url += 'Contact Information:\n';
      url += 'Email: ' + userData.contact.email + '\n';
        if (userData.contact.phonePrimary != '') url += 'Phone - Primary: ' + userData.contact.phonePrimary + '\n';
        if (userData.contact.phoneSecondary != '') url += 'Phone - Secondary: ' + userData.contact.phoneSecondary + '\n';
        if (userData.contact.phoneSatellite != '') url += 'Phone - Satellite: ' + userData.contact.phoneSatellite + '\n';
      url += 'EASA Subscriber: ' + userData.contact.subscriber + '\n\n';

      if (userData.personal.allergies != '') {
        url += 'Allergies:\n';
        url += userData.personal.allergies + '\n\n';
      }

      if (userData.optional.existingConditions != '') {
        url += 'Existing Conditions:\n';
        url += userData.optional.existingConditions + '\n\n';
      }

      if (userData.optional.contactsLocal != '') {
        url += 'Contacts - Local:\n';
        url += userData.optional.contactsLocal + '\n\n';
      }

      if (userData.optional.contactsInternational != '') {
        url += 'Contacts - International:\n';
        url += userData.optional.contactsInternational + '\n\n';
      }

      if (userData.optional.insuranceInformation != '') {
        url += 'Insurance Information:\n';
        url += userData.optional.insuranceInformation + '\n\n';
      }

    url += this.translate.instant('SEND_MSG') + '\n';
    url += '&phone=' + this.dataService.appData['whatsapp'];

    this.iab.create(encodeURI(url), '_system');
  }

  deleteData () {
    this.dataService.resetUserData();
    this.navCtrl.setRoot( WelcomePage );
  }
}

