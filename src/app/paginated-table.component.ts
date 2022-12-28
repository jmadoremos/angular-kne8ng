import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { FormData } from '../models/form-data';
import { TrackedData } from '../models/tracked-data';
import { StatefulData } from '../models/stateful-data';

import { FormDialogComponent, FormDialogData } from './form-dialog.component';

@Component({
  selector: 'paginated-table',
  templateUrl: './paginated-table.component.html',
  styleUrls: ['./paginated-table.component.css'],
})
export class PaginatedTableComponent implements OnChanges {
  tableData: TrackedData<FormData>[];
  displayedColumns: string[];

  constructor(public dialog: MatDialog) {
    this.tableData = [];
    this.displayedColumns = ['keyName', 'value', 'otherData', 'actions'];
  }

  @Input()
  public set data(val: StatefulData<FormData>[]) {
    this.onReset(val);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue) {
      this.onReset(changes.data.currentValue);
    }
  }

  onReset(data?: StatefulData<FormData>[] | TrackedData<FormData>[]) {
    this.tableData = [];

    if (data) {
      data.forEach((value, index) => {
        this.tableData.push({ ...value, original: value.data });
      });
    }
  }

  onUpdate(i: number) {
    const toUpdate = this.tableData[i].modified ?? this.tableData[i].original;

    let dialogRef = this.dialog.open<FormDialogComponent, FormDialogData>(
      FormDialogComponent,
      {
        data: {
          title: 'Update form',
          resolveLabel: 'Update',
          formData: { ...toUpdate },
        },
      }
    );

    dialogRef.afterClosed().subscribe((result: FormData) => {
      if (result) {
        console.log(`Data returned: ${JSON.stringify(result)}`);
        this.tableData[i].modified = result;

        if (this.tableData[i].state !== 'added') {
          this.tableData[i].state = 'altered';
        }
      }
    });
  }

  onRevert(i: number) {
    console.log(`Reverting item: ${this.tableData[i].data.key}`);
    delete this.tableData[i].modified;
    this.tableData[i].state = 'original';
  }

  onRemove(i: number) {
    console.log(`Removing item: ${this.tableData[i].data.key}`);
    this.tableData.splice(i, 1);
  }
}
