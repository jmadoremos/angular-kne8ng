import { Component } from '@angular/core';

import { FormData } from '../models/form-data';
import { IndexedData } from '../models/indexed-data';
import { PaginatedTableColumns } from '../models/table-column';
import { TrackedData } from '../models/tracked-data';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly name = 'Angular';
  readonly tableColumns: PaginatedTableColumns[];
  readonly tableDisplayedColumns: string[];
  tableData: TrackedData<FormData>[];

  constructor() {
    this.tableData = [];
    this.fetch().forEach((value) => {
      this.tableData.push({ state: 'original', data: value });
    });

    this.tableColumns = [
      {
        colKey: 'keyValue',
        colLabel: 'Key value',
        rowKeys: ['key', 'value'],
        displayed: true,
      },
      {
        colKey: 'name',
        colLabel: 'Name',
        rowKeys: ['name'],
        displayed: true,
      },
      {
        colKey: 'otherData',
        colLabel: 'Other data',
        rowKeys: ['otherData'],
        displayed: false,
      },
    ];
  }

  private fetch(): FormData[] {
    const arr: FormData[] = [];
    for (let i = 1; i <= 500000; i++) {
      arr.push({
        key: i.toString().padStart(5, '0'),
        name: String.fromCharCode(96 + (i % 25)),
        value: 'Sample',
        otherData: `Other data #${i}`,
      });
    }
    return arr;
  }

  onAdd(event: IndexedData<FormData>) {
    console.log(`Adding record: ${JSON.stringify(event.data)}`);

    this.tableData = [
      ...this.tableData,
      {
        state: 'added',
        data: event.data,
      },
    ];
  }

  onUpdate(event: IndexedData<FormData>) {
    console.log(`Updating data: ${JSON.stringify(event.data)}`);

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
      `Removing item: ${JSON.stringify(this.tableData[event.index].data)}`
    );

    this.tableData = [
      ...this.tableData.slice(0, event.index),
      ...this.tableData.slice(event.index + 1),
    ];
  }
}
