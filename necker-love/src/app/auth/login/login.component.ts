import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
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
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.email
        ]
      }),
      password: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    });
  }

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.email.value, this.password.value);
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
}
