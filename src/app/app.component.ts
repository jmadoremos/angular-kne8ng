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

  constructor(public dialog: MatDialog) {
    this.tableData = [];
    for (let i = 1; i <= 5; i++) {
      this.tableData.push({
        state: 'original',
        data: {
          name: i.toString(),
          value: 'Sample',
          otherData: `Other Data ${i}`,
        },
      });
    }
  }

  onAdd() {
    let dialogRef = this.dialog.open<FormDialogComponent, FormDialogData>(
      FormDialogComponent,
      {
        data: {
          title: 'Add form',
          resolveLabel: 'Add',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result: FormData) => {
      console.log(`Data returned: ${JSON.stringify(result)}`);
      if (result) {
        const newData: StatefulData<FormData> = {
          state: 'added',
          data: result,
        };

        this.tableData = [...this.tableData, newData];
      }
    });
  }
}
