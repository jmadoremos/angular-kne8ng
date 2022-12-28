import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { FormData } from '../models/form-data';
import { PaginatedTableData } from '../models/paginated-table-data';
import { StatefulData } from '../models/stateful-data';

import { FormDialogComponent, FormDialogData } from './form-dialog.component';

@Component({
  selector: 'paginated-table',
  templateUrl: './paginated-table.component.html',
})
export class PaginatedTableComponent implements OnChanges {
  originalData: PaginatedTableData<FormData>[];
  modifiedData: PaginatedTableData<FormData>[];

  displayedColumns = ['nameValue', 'otherData', 'actions'];

  constructor(public dialog: MatDialog) {
    this.onReset();
  }

  @Input()
  public set data(val: StatefulData<FormData>[]) {
    this.onReset(val);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentValue) {
      this.onReset();
    }
  }

  onReset(data?: StatefulData<FormData>[]) {
    this.originalData = [];
    this.modifiedData = [];

    if (data) {
      data.forEach((value) => {
        this.originalData.push(value);
      });
    }
  }

  onUpdate(i) {
    const toUpdate = this.originalData[i].modified ?? this.originalData[i].data;

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
      console.log(`Data returned: ${JSON.stringify(result)}`);
      if (result) {
        this.originalData[i].modified = result;
        if (this.originalData[i].state !== 'added') {
          this.originalData[i].state = 'altered';
        }
      }
    });
  }

  onRevert(i) {
    console.log(
      `Reverting item ${this.originalData[i].data.name}: ${this.originalData[i].data.value} (index: ${i})`
    );
    delete this.originalData[i].modified;
    this.originalData[i].state = 'original';
  }

  onRemove(i) {
    console.log(
      `Removing item ${this.originalData[i].data.name}: ${this.originalData[i].data.value} (index: ${i})`
    );
    this.originalData.splice(i, 1);
  }
}
