import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Profile } from './../profile.model';
import { ProfileService } from './../profile.service';
import { AuthService } from './../../auth/auth.service';
import { StateHelper } from '../../core/helpers/state.helper';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit, OnDestroy {
  profiles: Profile[] = [];
  isLoading = false;
  isAuth = false;
  private profileSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public profileService: ProfileService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.profileSub = this.profileService.getProfileUpdateListener().subscribe((profileData: {
      profiles: Profile[]
    }) => {
      this.isLoading = false;
      this.profiles = profileData.profiles.filter(p => p.profileImage !== undefined);
      this.profiles.forEach(profile => {
        if (profile.firstName) {
          profile.firstName = profile.firstName.replace(/\s*,\s*/g, ', ');
        }
        if (profile.lastName) {
         profile.lastName = profile.lastName.replace(/\s*,\s*/g, ', ');
        }
        if (profile.interests) {
          profile.interests = profile.interests.replace(/\s*,\s*/g, ', ').replace(/\w*/g, text => {
            return text.charAt(0).toUpperCase() + text.substr(1);
          });
        }
        if (profile.state) {
          profile.state = StateHelper.getStateNameByCode(profile.state).replace(/\w*/g, text => {
            return text.charAt(0).toUpperCase() + text.substr(1);
          });
        }
      });
    });
    this.isAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });
  }

  ngOnDestroy() {
    this.profileSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
