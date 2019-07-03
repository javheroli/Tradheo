import { FormControl } from '@angular/forms';
import { DataManagement } from 'src/app/services/dataManagement';
import { Injectable } from '@angular/core';

@Injectable()
export class UsernameValidator {
  debouncer: any;

  constructor(public dm: DataManagement) {}

  checkUsername(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise(resolve => {
      this.debouncer = setTimeout(() => {
        this.dm.validationUsername(control.value).then(
          res => {
            resolve(null);
          },
          err => {
            resolve({ usernameInUse: true });
          }
        );
      }, 1000);
    });
  }
}
