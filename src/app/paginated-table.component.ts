import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { FormData } from '../models/form-data';
import { IndexedData } from '../models/indexed-data';
import { PaginatedTableColumns } from '../models/table-column';
import { TrackedData } from '../models/tracked-data';

import { FormDialogComponent, FormDialogData } from './form-dialog.component';

@Component({
  selector: 'paginated-table',
  templateUrl: './paginated-table.component.html',
  styleUrls: ['./paginated-table.component.css'],
})
export class PaginatedTableComponent {
  private _tableData: TrackedData<FormData>[];
  private _filteredData: TrackedData<FormData>[];
  private _tableColumns: PaginatedTableColumns[];
  private _displayedColumns: string[];

  @Output() add: EventEmitter<IndexedData<FormData>>;
  @Output() update: EventEmitter<IndexedData<FormData>>;
  @Output() revert: EventEmitter<IndexedData<never>>;
  @Output() remove: EventEmitter<IndexedData<never>>;

  readonly pageSizeOptions: number[];
  rowLength: number;
  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MatDialog) {
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.revert = new EventEmitter();
    this.remove = new EventEmitter();

    this.pageSizeOptions = [5, 10, 25];
    this.rowLength = 0;
    this.pageSize = 5;
    this.pageIndex = 0;
  }

  @Input()
  set dataSource(val: TrackedData<FormData>[]) {
    this._tableData = Object.assign([], val);
    this.rowLength = this._tableData.length;

    if (this.pageIndex >= this.maxPageIndex) {
      this.pageIndex--;
      if (this.pageIndex < 0) {
        this.pageIndex = 0;
      }
    }

    this.updateFilteredData();
  }

  get dataSource(): TrackedData<FormData>[] {
    return this._filteredData;
  }

  @Input()
  set tableColumns(val: PaginatedTableColumns[]) {
    this._tableColumns = val;

    this._displayedColumns = val
      .filter((value) => value.displayed)
      .map((value) => value.colKey);
    this._displayedColumns.push('actions');
  }

  get tableColumns(): PaginatedTableColumns[] {
    return this._tableColumns;
  }

  get displayColumns(): string[] {
    return this._displayedColumns;
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
        const d: IndexedData<FormData> = {
          index: this._tableData.length,
          data: result,
        };

        this.add.emit(d);
      }
    });
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
