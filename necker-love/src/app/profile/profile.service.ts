import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { map } from 'rxjs/operators';

import { Profile } from './profile.model';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profiles: Profile[] = [];
  private profilesUpdated = new Subject<{profiles: Profile[]}>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getProfiles(profileId: string, option: string, query: string) {
    const queryParams = `?&option=${option}&query=${query}&profileId=${profileId}`;
    this.http.get<{message: string, profiles: any}>(BACKEND_URL + '/search' + queryParams).pipe(map(profileData => {
      return {
        profiles: profileData.profiles.map(profile => {
          return {
            id: profile._id,
            userName: profile.userName,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profileImage: profile.profileImage,
            interests: profile.interests,
            state: profile.state
          };
        })
      };
    })).subscribe(transformedProfileData => {
      this.profiles = transformedProfileData.profiles;
      this.profilesUpdated.next({
        profiles: [...this.profiles]
      });
    });
  }

  getProfileUpdateListener() {
    return this.profilesUpdated.asObservable();
  }

  getProfile(id: string) {
    return this.http.get<{_id: string, userName: string, firstName: string, lastName: string, profileImage: string, interests: string, state: string}>(BACKEND_URL + '/user/' + id);
  }

  updateProfile(id: string, firstName: string, lastName: string, image: File | string, interests: string, state: string) {
    let profileData: Profile | FormData;
    if (typeof(image) === 'object') {
      profileData = new FormData();
      profileData.append('id', id);
      profileData.append('firstName', firstName);
      profileData.append('lastName', lastName);
      profileData.append('image', image, firstName);
      profileData.append('interests', interests);
      profileData.append('state', state);
    } else {
      profileData = {
        id,
        userName: '',
        firstName,
        lastName,
        profileImage: image,
        interests,
        state
      };
    }
    return this.http.put(BACKEND_URL + '/profile/' + id, profileData);
  }
}
