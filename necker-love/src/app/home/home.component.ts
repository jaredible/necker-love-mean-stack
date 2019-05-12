import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../auth/auth.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, router: Router) {
    if (authService.getIsAuth()) {
      router.navigate(['/search']);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
