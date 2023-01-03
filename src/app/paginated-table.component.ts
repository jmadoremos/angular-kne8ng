import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  private _tableData: TrackedData<FormData>[] = [];
  private _filteredData: TrackedData<FormData>[] = [];
  private _tableColumns: PaginatedTableColumns[] = [];
  private _displayedColumns: string[] = ['actions'];

  @Output() add: EventEmitter<IndexedData<FormData>> = new EventEmitter();
  @Output() update: EventEmitter<IndexedData<FormData>> = new EventEmitter();
  @Output() revert: EventEmitter<IndexedData<never>> = new EventEmitter();
  @Output() remove: EventEmitter<IndexedData<never>> = new EventEmitter();

  readonly pageSizeOptions: number[] = [5, 10, 25];
  pageSize: number = 5;
  rowLength: number = 0;
  pageIndex: number = 0;

  readonly filterMinLen: number = 3;
  filterControl: FormControl<string> = new FormControl(
    '',
    Validators.minLength(this.filterMinLen)
  );
  private _filterTimeout: number = null;
  private readonly _filterDelayMs: number = 500;

  constructor(private dialog: MatDialog) {}

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

  private updateFilteredData(filter = this.filterControl.value) {
    let tmp: TrackedData<FormData>[] = Object.assign([], this._tableData);

    // Apply filter
    if (filter && filter.length >= this.filterMinLen) {
      tmp = tmp.filter(
        (value) =>
          value.data.key.startsWith(filter) || value.data.value.includes(filter)
      );
    }

    // Reflect filtered data with pagination
    this._filteredData = tmp.slice(
      this.pageIndex * this.pageSize,
      this.pageSize * (this.pageIndex + 1)
    );

    // Update row length
    this.rowLength = tmp.length;
  }

  onFilterChange() {
    clearTimeout(this._filterTimeout);
    this._filterTimeout = setTimeout(() => {
      // Reset to first page
      this.pageIndex = 0;
      // Update table
      this.updateFilteredData(this.filterControl.value);
    }, this._filterDelayMs);
  }

  onFilterReset() {
    this.filterControl.setValue('');
    this.updateFilteredData();
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
