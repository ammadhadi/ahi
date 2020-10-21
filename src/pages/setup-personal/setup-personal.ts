import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/DataService';
import { WelcomePage } from '../welcome/welcome';
import { SetupContactPage } from '../setup-contact/setup-contact';

import { AgeValidator } from  '../../validators/age';
import { HeightValidator } from  '../../validators/height';
import { WeightValidator } from  '../../validators/weight';

//@IonicPage()
@Component({
  selector: 'page-setup-personal',
  templateUrl: 'setup-personal.html',
})
export class SetupPersonalPage {

  personalForm: FormGroup;
  submitAttempt: boolean;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataService: DataService
  ) {

    this.submitAttempt = false;

    this.personalForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(80), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(80), Validators.required])],
      sex: ['', Validators.required],
      age: ['', AgeValidator.isValid],
      height: ['', HeightValidator.isValid],
      weight: ['', WeightValidator.isValid],
      allergies: ['', Validators.compose([Validators.maxLength(400)])]
    });
  }

  saveData () {
    if (this.personalForm.valid) {
      this.submitAttempt = false;
      this.dataService.setUserData('personal', this.personalForm.value);
      this.navCtrl.push( SetupContactPage );
    } else {
      this.submitAttempt = true;
    }
  }

  cancel () {
    this.navCtrl.setRoot( WelcomePage );
  }
}
