import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/DataService';
import { WelcomePage } from '../welcome/welcome';
import { SetupOptionalPage } from '../setup-optional/setup-optional';

import { EmailValidator } from  '../../validators/email';

//@IonicPage()
@Component({
  selector: 'page-setup-contact',
  templateUrl: 'setup-contact.html',
})
export class SetupContactPage {

  contactForm: FormGroup;
  submitAttempt: boolean;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataService: DataService
  ) {

    this.submitAttempt = false;

    this.contactForm = formBuilder.group({
      subscriber: ['', Validators.required],
      email: ['', EmailValidator.isValid],
      phonePrimary: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9\- +]*')])],
      phoneSecondary: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9\- +]*')])],
      phoneSatellite: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9\- +]*')])]
    });
  }

  saveData () {
    if (this.contactForm.valid) {
      this.submitAttempt = false;
      this.dataService.setUserData('contact', this.contactForm.value);
      this.navCtrl.push( SetupOptionalPage );
    } else {
      this.submitAttempt = true;
    }
  }

  cancel () {
    this.navCtrl.setRoot( WelcomePage );
  }
}
