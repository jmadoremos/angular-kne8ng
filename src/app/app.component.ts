import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FormData } from '../models/form-data';
import { IndexedData } from '../models/indexed-data';
import { StatefulData } from '../models/stateful-data';
import { TrackedData } from '../models/tracked-data';

import { FormDialogComponent, FormDialogData } from './form-dialog.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';
  tableData: TrackedData<FormData>[];

  constructor(private dialog: MatDialog) {
    this.tableData = [];
    this.fetch().forEach((value) => {
      this.tableData.push({ state: 'original', data: value });
    });
  }

  private fetch(): FormData[] {
    const arr: FormData[] = [];
    for (let i = 1; i <= 7; i++) {
      arr.push({
        key: i.toString().padStart(5, '0'),
        name: String.fromCharCode(96 + (i % 25)),
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

  onUpdate(event: IndexedData<FormData>) {
    console.log(
      `Updating item: ${JSON.stringify(this.tableData[event.index].data.key)}`
    );
    console.log(`Updated data: ${JSON.stringify(event.data)}`);

    this.tableData[event.index].modified = event.data;
    if (this.tableData[event.index].state !== 'added') {
      this.tableData[event.index].state = 'altered';
    }
  }

  onRevert(event: IndexedData<never>) {
    console.log(
      `Reverting item: ${JSON.stringify(this.tableData[event.index].data.key)}`
    );

    delete this.tableData[event.index].modified;
    this.tableData[event.index].state = 'original';
  }

  onRemove(event: IndexedData<never>) {
    console.log(
      `Removing item: ${JSON.stringify(this.tableData[event.index].data.key)}`
    );
    this.tableData = [
      ...this.tableData.slice(0, event.index),
      ...this.tableData.slice(event.index + 1),
    ];
  }
}
