import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { ProfileModule } from '../profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    SearchRoutingModule,
    ProfileModule
  ],
  declarations: [SearchComponent]
})
export class SearchModule {}
