import { FormControl } from '@angular/forms';
import { DataManagement } from 'src/app/services/dataManagement';
import { Injectable } from '@angular/core';

@Injectable()
export class PhoneNumberValidatorForEdit {
  debouncer: any;

  constructor(public dm: DataManagement) {}

  checkPhoneNumber(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise(resolve => {
      this.debouncer = setTimeout(() => {
        this.dm.validationPhoneNumberForEdit(control.value).then(
          res => {
            resolve(null);
          },
          err => {
            resolve({ phoneNumberInUse: true });
          }
        );
      }, 1000);
    });
  }
}
