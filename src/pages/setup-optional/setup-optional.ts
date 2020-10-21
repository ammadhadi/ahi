import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/DataService';
import { InstructionsPage } from '../instructions/instructions';

//@IonicPage()
@Component({
  selector: 'page-setup-optional',
  templateUrl: 'setup-optional.html',
})
export class SetupOptionalPage {

  optionalForm: FormGroup;
  submitAttempt: boolean;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataService: DataService
  ) {

    this.submitAttempt = false;

    this.optionalForm = formBuilder.group({
      existingConditions: ['', Validators.compose([Validators.maxLength(400)])],
      contactsLocal: ['', Validators.compose([Validators.maxLength(400)])],
      contactsInternational: ['', Validators.compose([Validators.maxLength(400)])],
      insuranceInformation: ['', Validators.compose([Validators.maxLength(400)])]
    });
  }
cancel(){
  
}
  saveData () {
    if (this.optionalForm.valid) {
      this.submitAttempt = false;
      this.dataService.setUserData('optional', this.optionalForm.value);
      this.navCtrl.setRoot( InstructionsPage, {
        thankYou: true
      });
    } else {
      this.submitAttempt = true;
    }
  }
}
