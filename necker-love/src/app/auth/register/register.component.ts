import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth.service';
import { uniqueEmail, passwordsMatch } from './../auth-form.validator';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  private authStatus: Subscription;

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.authStatus = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ], [uniqueEmail(this.authService)]),
      password: new FormControl('', [
        Validators.required,

      ]),
      confirmPassword: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
    }, [passwordsMatch()]);
  }

  onRegister() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.register(this.email.value, this.password.value);
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatus.unsubscribe();
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
