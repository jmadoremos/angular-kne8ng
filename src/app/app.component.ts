import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FormData } from '../models/form-data';
import { StatefulData } from '../models/stateful-data';

import { FormDialogComponent, FormDialogData } from './form-dialog.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular';
  tableData: StatefulData<FormData>[];

  constructor(public dialog: MatDialog) {
    this.tableData = [];
  }

  ngOnInit() {
    this.fetch().forEach((value) => {
      this.tableData.push({ state: 'original', data: value });
    });
  }

  private fetch(): FormData[] {
    const arr: FormData[] = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        key: (i + 1).toString().padStart(5, '0'),
        name: String.fromCharCode(97 + i),
        value: 'Sample',
        otherData: `Other data #${i + 1}`,
      });
    }
    return arr;
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
      if (result) {
        console.log(`Adding record: ${JSON.stringify(result)}`);
        const newData: StatefulData<FormData> = {
          state: 'added',
          data: result,
        };

        this.tableData = [...this.tableData, newData];
      }
    });
  }
}
