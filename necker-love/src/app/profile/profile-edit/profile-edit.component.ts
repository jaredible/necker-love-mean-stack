import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Profile } from '../profile.model';
import { ProfileService } from '../profile.service';
import { AuthService } from './../../auth/auth.service';
import { StateHelper } from '../../core/helpers/state.helper';

@Component({
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  profile: Profile = {
    id: '',
    userName: '',
    firstName: '',
    lastName: '',
    profileImage: '',
    interests: '',
    state: ''
  };
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  selectedState = '';
  profileId: string;
  private authStatusSub: Subscription;
  states = StateHelper.getStates();

  constructor(public profileService: ProfileService, public route: ActivatedRoute, private authService: AuthService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      image: new FormControl(null, {
        validators: []
      }),
      firstName: new FormControl('', {
        validators: [
          Validators.maxLength(50)
        ]
      }),
      lastName: new FormControl('', {
        validators: [
          Validators.maxLength(50)
        ]
      }),
      interests: new FormControl('', {
        validators: [
          Validators.maxLength(2000)
        ]
      }),
      state: new FormControl('', {
        validators: [
          Validators.maxLength(52)
        ]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.profileId = paramMap.get('profileId');
      this.isLoading = false;
      this.profileService.getProfile(this.profileId).subscribe(profileData => {
        this.isLoading = false;
        this.profile.id = profileData._id;
        this.profile.userName = profileData.userName;
        if (profileData.firstName) {
          this.profile.firstName = profileData.firstName;
          this.form.patchValue({
            firstName: this.profile.firstName.replace(/\w*/g, text => {
              return text.charAt(0).toUpperCase() + text.substr(1);
            })
          });
        }
        if (profileData.lastName) {
          this.profile.lastName = profileData.lastName;
          this.form.patchValue({
            lastName: this.profile.lastName.replace(/\w*/g, text => {
              return text.charAt(0).toUpperCase() + text.substr(1);
            })
          });
        }
        if (profileData.profileImage) {
          this.profile.profileImage = profileData.profileImage;
          this.form.patchValue({
            image: this.profile.profileImage
          });
        }
        if (profileData.interests) {
          this.profile.interests = profileData.interests.replace(/\s*,\s*/g, ', ');
          this.form.patchValue({
            interests: this.profile.interests.replace(/\s*,\s*/g, ', ').replace(/\w*/g, text => {
              return text.charAt(0).toUpperCase() + text.substr(1);
            })
          });
        }
        if (profileData.state) {
          this.profile.state = profileData.state;
          this.form.patchValue({
            state: this.profile.state.toLowerCase()
          });
        }
        this.selectedState = this.profile.state.toUpperCase();
        this.imagePreview = this.profile.profileImage;
      });
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.profileService.updateProfile(this.profileId, this.firstName.value, this.lastName.value, this.image.value, this.interests.value, this.state.value).subscribe(response => {
      if (response) {
        this.snackBar.open('Saved', 'close', {
          duration: 2000,
          panelClass: ['alert-success']
        });
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.snackBar.dismiss();
  }

  get image() {
    return this.form.get('image');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get interests() {
    return this.form.get('interests');
  }

  get state() {
    return this.form.get('state');
  }
}
