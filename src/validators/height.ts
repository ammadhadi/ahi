import { FormControl } from '@angular/forms';

export class HeightValidator {

    static isValid(control: FormControl): any {

        if(isNaN(control.value)){
            return {
                "not a number": true
            };
        }

        if(control.value % 1 !== 0){
            return {
                "not a whole number": true
            };
        }

        if(control.value < 30){
            return {
                "too short": true
            };
        }

        if (control.value > 274){
            return {
                "too tall": true
            };
        }

        return null;
    }

}
