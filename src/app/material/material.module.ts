import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
// import { MatPaginator } from '@angular/material/paginator';

const Material = [
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  // MatCheckboxModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatMenuModule,
  // MatPaginator,
];

@NgModule({
  imports: [Material],
  exports: [Material]
})
export class MaterialModule { }
