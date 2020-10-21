import { FormControl } from '@angular/forms';

export class WeightValidator {

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

        if(control.value < 1){
            return {
                "too light": true
            };
        }

        if (control.value > 272){
            return {
                "too heavy": true
            };
        }

        return null;
    }

}
