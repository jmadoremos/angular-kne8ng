import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { FormDialogComponent } from './form-dialog.component';
import { HelloComponent } from './hello.component';
import { PaginatedTableComponent } from './paginated-table.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
  ],
  declarations: [
    AppComponent,
    FormDialogComponent,
    HelloComponent,
    PaginatedTableComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
