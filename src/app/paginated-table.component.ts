import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private dialog: MatDialog) {
    this.displayedColumns = ['keyName', 'value', 'otherData', 'actions'];
  }

  @Input()
  set dataSource(val: StatefulData<FormData>[]) {
    this._tableData = val;
  }

  get dataSource(): TrackedData<FormData>[] {
    return this._tableData;
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
    this.dataSource.splice(i, 2);
  }
}
