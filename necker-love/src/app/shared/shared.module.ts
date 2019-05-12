import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule, MatSelectModule, MatRadioModule, MatBottomSheet, MatBottomSheetRef, MatBottomSheetModule, MatListModule, MatChipsModule, MatIconModule, MatTabsModule, MatSnackBar, MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatListModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule
  ]
})
export class SharedModule {}
