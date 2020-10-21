import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'DataService',
  templateUrl: 'DataService.html',
})
export class DataService {

  config:any;
  geoData:any;
  appData:any;
  userData:any;

  constructor(
    public storage: Storage,
    public translate: TranslateService
  ) {
      this.config = {
        "version": "v1.0.0",
        "website_display": "www.eas-africa.com",
        "website_url": "http://www.eas-africa.com/",
        "data_url": "http://www.eas-africa.com/request-evacuation/data/",
        "whatsapp_url": "https://api.whatsapp.com/send?text="
        }
      this.geoData = {
          "latitude": "",
          "longitude": ""
        };
      this.appData = {
          "created": "2017-12-06 16:00:00",
          "version": "v1.0.0",
          "whatsapp": "447456672860",
          "phone": "+235 90 44 01 23",
          "satellite": "8816 3166 9138",
          "subscription_url": "http://www.eas-africa.com/subscriptions",
          "terms_url": "http://www.eas-africa.com/terms",
          "privacy_url": "http://www.eas-africa.com/privacy"
        };
      this.userData = {
          "setup": false,
          "language": "en"
        };
  }

  getConfig (parameter) {
      return this.config[parameter];
  }

  setLanguage (language) {
      this.translate.use(language);
      this.userData['language'] = language;
  }

  getGeo (parameter) {
      return this.geoData[parameter];
  }

  setGeo (parameter, value) {
    var dms = this.geoToDMS(parameter, value);
    if (dms != 0) value = dms;

    this.geoData[parameter] = value;
  }

  geoToDMS (parameter, value) {
    if (Number(value) == NaN) return 0;

    var max = (parameter == 'latitude') ? 90 : 180;
    var sign = value < 0 ? -1 : 1;
    var abs = Math.abs(Math.round(value * 1000000));

    if (abs > (max * 1000000)) return 0;

    var dec = abs % 1000000 / 1000000;
    var deg = Math.floor(abs / 1000000) * sign;
    var min = Math.floor(dec * 60);
    var sec = (dec - min / 60) * 3600;
    var dir = (parameter == 'latitude') ? 'N' : 'E';
    if (deg < 0) dir = (parameter == 'latitude') ? 'S' : 'W';

    return Math.abs(deg) + 'º ' + min + "' " + sec.toFixed(4) + '" ' + dir;
  }

  getLanguage () {
      return this.userData['language'];
  }

  setAppData (data) {
      this.appData = data;
  }

  getAppData () {
      return this.appData;
  }

  getAppDataParam (parameter) {
      return this.appData[parameter];
  }

  setUserData (step, data) {
    this.userData[step] = data;

    if (step != 'contact') {
      this.userData.setup = true;
      this.storage.set('userData', this.userData);
    }
  }

  flashUserData (data) {
    this.userData = data;
  }

  resetUserData () {
    this.userData = {
          "setup": false,
          "language": "en"
        };
    this.setLanguage(this.userData['language']);
    this.storage.set('userData', this.userData);
  }

  getUserData () {
    return this.userData;
  }
}
