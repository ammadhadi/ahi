import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/DataService';
import { HomePage } from '../home/home';
import { WelcomePage } from '../welcome/welcome';

import { AgeValidator } from  '../../validators/age';
import { HeightValidator } from  '../../validators/height';
import { WeightValidator } from  '../../validators/weight';
import { EmailValidator } from  '../../validators/email';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public englishBtn: string = 'secondary';
  public frenchBtn: string = 'light';

  personalForm: FormGroup;
  contactForm: FormGroup;
  optionalForm: FormGroup;
  submitAttempt: boolean;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    private dataService: DataService,
    public alertCtrl: AlertController
  ) {

    this.submitAttempt = false;

    let userData = dataService.getUserData();

    this.personalForm = formBuilder.group({
      firstName: [userData.personal.firstName, Validators.compose([Validators.maxLength(80), Validators.required])],
      lastName: [userData.personal.lastName, Validators.compose([Validators.maxLength(80), Validators.required])],
      sex: ['', Validators.required],
      age: [userData.personal.age, AgeValidator.isValid],
      height: [userData.personal.height, HeightValidator.isValid],
      weight: [userData.personal.weight, WeightValidator.isValid],
      allergies: [userData.personal.allergies, Validators.compose([Validators.maxLength(400)])]
    });

    this.contactForm = this.formBuilder.group({
      subscriber: ['', Validators.required],
      email: [userData.contact.email, EmailValidator.isValid],
      phonePrimary: [userData.contact.phonePrimary, Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9\- +]*')])],
      phoneSecondary: [userData.contact.phoneSecondary, Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9\- +]*')])],
      phoneSatellite: [userData.contact.phoneSatellite, Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9\- +]*')])]
    });

    this.optionalForm = formBuilder.group({
      existingConditions: [userData.optional.existingConditions, Validators.compose([Validators.maxLength(400)])],
      contactsLocal: [userData.optional.contactsLocal, Validators.compose([Validators.maxLength(400)])],
      contactsInternational: [userData.optional.contactsInternational, Validators.compose([Validators.maxLength(400)])],
      insuranceInformation: [userData.optional.insuranceInformation, Validators.compose([Validators.maxLength(400)])]
    });

    if (this.dataService.getLanguage() == 'en') {
      this.englishBtn = 'secondary';
      this.frenchBtn = 'light';
    } else {
      this.englishBtn = 'light';
      this.frenchBtn = 'secondary';
    }
  }

  ionViewDidLoad() {
    let userData = this.dataService.getUserData();
    this.personalForm.controls.sex.setValue(userData.personal.sex);
    this.personalForm.controls.allergies.setValue(userData.personal.allergies);
    this.contactForm.controls.subscriber.setValue(userData.contact.subscriber);
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

  saveData () {
    if (this.personalForm.valid && this.contactForm.valid && this.optionalForm.valid) {
      this.submitAttempt = false;
      this.dataService.setUserData('personal', this.personalForm.value);
      this.dataService.setUserData('contact', this.contactForm.value);
      this.dataService.setUserData('optional', this.optionalForm.value);

      this.navCtrl.setRoot( HomePage, {
        settingsUpdated: true
      });
    } else {
      this.submitAttempt = true;
    }
  }

  cancel () {
    this.navCtrl.setRoot( HomePage );
  }

  deleteData () {
    this.alertCtrl.create({
      title: this.translate.instant('ALERT_RESET'),
      message: this.translate.instant('ALERT_RESET_MSG'),
      buttons: [
        {
          text: this.translate.instant('CANCEL'),
          handler: () => { }
        },
        {
          text: this.translate.instant('BTN_RESET_DATA'),
          handler: () => {
            this.dataService.resetUserData();
            this.navCtrl.setRoot( WelcomePage );
          }
        }
      ]
    }).present();
  }
}
