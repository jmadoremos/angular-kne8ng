import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { FormData } from '../models/form-data';
import { IndexedData } from '../models/indexed-data';
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
  private _filteredData: TrackedData<FormData>[];

  @Output() update: EventEmitter<IndexedData<FormData>>;
  @Output() revert: EventEmitter<IndexedData<never>>;
  @Output() remove: EventEmitter<IndexedData<never>>;

  readonly displayedColumns: string[];
  readonly pageSizeOptions: number[];
  rowLength: number;
  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MatDialog) {
    this.update = new EventEmitter();
    this.revert = new EventEmitter();
    this.remove = new EventEmitter();

    this.displayedColumns = ['keyName', 'value', 'otherData', 'actions'];
    this.pageSizeOptions = [5, 10, 25];
    this.rowLength = 0;
    this.pageSize = 5;
    this.pageIndex = 0;
  }

  @Input()
  set dataSource(val: StatefulData<FormData>[]) {
    this._tableData = Object.assign([], val);
    this.rowLength = this._tableData.length;

    this.updateFilteredData();
  }

  get dataSource(): TrackedData<FormData>[] {
    return this._filteredData;
  }

  get maxPageIndex(): number {
    return Math.ceil(this.rowLength / this.pageSize);
  }

  private updateFilteredData() {
    this._filteredData = this._tableData.slice(
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
        const d: IndexedData<FormData> = {
          index: this.pageIndex * this.pageSize + i,
          data: result,
        };

        console.log(`Emitting "update" event: ${JSON.stringify(d)}`);
        this.update.emit(d);
      }
    });
  }

  onRevert(i: number) {
    const d: IndexedData<never> = {
      index: this.pageIndex * this.pageSize + i,
    };

    console.log(`Emitting "revert" event: ${JSON.stringify(d)}`);
    this.revert.emit(d);
  }

  onRemove(i: number) {
    const d: IndexedData<never> = {
      index: this.pageIndex * this.pageSize + i,
    };

    console.log(`Emitting "remove" event: ${JSON.stringify(d)}`);
    this.remove.emit(d);
  }

  onPageUpdate(e: PageEvent) {
    this.pageIndex =
      this.pageSize === e.pageSize || e.pageIndex === 0
        ? e.pageIndex
        : e.pageIndex - 1;
    this.pageSize = e.pageSize;

    this.updateFilteredData();
  }
}
