import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class PaginatedTableComponent {
  private _tableData: TrackedData<FormData>[];
  displayedColumns: string[];
  @Output() change: EventEmitter<StatefulData<FormData>[]>;

  rowLength: number;
  pageSize: number;
  pageSizeOptions: number[];
  pageIndex: number;

  constructor(private dialog: MatDialog) {
    this.displayedColumns = ['keyName', 'value', 'otherData', 'actions'];
    this.change = new EventEmitter();

    this.rowLength = 0;
    this.pageSize = 5;
    this.pageSizeOptions = [5, 10, 25];
    this.pageIndex = 0;
  }

  @Input()
  set dataSource(val: StatefulData<FormData>[]) {
    this._tableData = Object.assign([], val);
    this.rowLength = this._tableData.length;
  }

  get dataSource(): TrackedData<FormData>[] {
    return this._tableData.slice(
      this.pageIndex * this.pageSize,
      this.pageSize * (this.pageIndex + 1)
    );
  }

  onUpdate(i: number) {
    const toUpdate = this.dataSource[i].modified ?? this.dataSource[i].data;

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
        this.dataSource[i].modified = result;

        if (this.dataSource[i].state !== 'added') {
          this.dataSource[i].state = 'altered';
        }
      }
    });
  }

  onRevert(i: number) {
    console.log(`Reverting item: ${this.dataSource[i].data.key}`);
    delete this.dataSource[i].modified;
    this.dataSource[i].state = 'original';
  }

  onRemove(i: number) {
    console.log(`Removing item: ${this.dataSource[i].data.key}`);
    this.dataSource.splice(i, 1);
    this.rowLength--;
    this.pageIndex = this.rowLength / this.pageSize - 1;
  }

  onChangePage(e: PageEvent) {
    this.pageIndex = this.pageSize === e.pageSize ? e.pageIndex : 0;
    this.pageSize = e.pageSize;
  }
}
