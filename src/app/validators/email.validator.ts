import { FormControl } from '@angular/forms';
import { DataManagement } from 'src/app/services/dataManagement';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomEmailValidator {
  debouncer: any;

  constructor(public dm: DataManagement) {}

  checkEmail(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise(resolve => {
      this.debouncer = setTimeout(() => {
        this.dm.validationEmail(control.value).then(
          res => {
            resolve(null);
          },
          err => {
            resolve({ emailInUse: true });
          }
        );
      }, 1000);
    });
  }
}
