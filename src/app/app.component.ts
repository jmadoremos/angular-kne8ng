import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FormData } from '../models/form-data';
import { StatefulData } from '../models/stateful-data';

import { FormDialogComponent, FormDialogData } from './form-dialog.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';
  tableData: StatefulData<FormData>[];

  constructor(private dialog: MatDialog) {
    this.tableData = [];
    this.fetch().forEach((value) => {
      this.tableData.push({ state: 'original', data: value });
    });
  }

  private fetch(): FormData[] {
    const arr: FormData[] = [];
    for (let i = 1; i <= 5; i++) {
      arr.push({
        key: i.toString().padStart(5, '0'),
        name: String.fromCharCode(96 + i),
        value: 'Sample',
        otherData: `Other data #${i}`,
      });
    }
    return arr;
  }

  onAdd() {
    const dialogRef = this.dialog.open<FormDialogComponent, FormDialogData>(
      FormDialogComponent,
      {
        data: {
          title: 'Add form',
          resolveLabel: 'Add',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result: FormData) => {
      if (result) {
        console.log(`Adding record: ${JSON.stringify(result)}`);
        this.tableData = [
          ...this.tableData,
          {
            state: 'added',
            data: result,
          },
        ];
      }
    });
  }
}
