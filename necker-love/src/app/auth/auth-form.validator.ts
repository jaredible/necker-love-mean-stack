import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export function uniqueEmail(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return authService.validateEmail(control.value).toPromise().then(res => {
      return res.emailTaken ? {emailTaken: true} : null;
    });
  };
}

export function passwordsMatch(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const password = control.get('password').value;
    const confirm = control.get('confirmPassword').value;
    if (confirm !== password) {
      return {
        passwordMatch: false
      };
    }
    return null;
  };
}
