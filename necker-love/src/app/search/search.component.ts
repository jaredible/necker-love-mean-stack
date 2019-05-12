import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './../auth/auth.service';
import { ProfileService } from './../profile/profile.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  inputOption = 'interests';
  profileId: string;

  private authStatusSub: Subscription;

  constructor(public profileService: ProfileService, private authService: AuthService) {
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

    this.profileId = this.authService.getUserId();

    this.form = new FormGroup({
      option: new FormControl(this.inputOption, {
        validators: []
      }),
      query: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    });

    this.option.valueChanges.subscribe(e => {
      this.inputOption = e;
    });
  }

  onSearch() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.profileService.getProfiles(this.profileId, this.option.value, this.query.value);
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  get option() {
    return this.form.get('option');
  }

  get query() {
    return this.form.get('query');
  }
}
