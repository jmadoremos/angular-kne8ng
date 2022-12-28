import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormData } from '../models/form-data';

@Component({
  selector: 'form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css'],
})
export class FormDialogComponent {
  public title: string;
  public resolveLabel: string;
  public formData: FormData;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent, FormData>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {
    this.title = data.title || 'Form Dialog';
    this.resolveLabel = data.resolveLabel || 'Resolve';

    this.formData = data.formData || {
      name: '',
      value: '',
      otherData: '',
    };
  }

  public onResolve() {
    Object.keys(this.formData).forEach((key) => {
      if (typeof this.formData[key] === 'string') {
        this.formData[key] = this.formData[key].trim();
      }
    });

    if (!this.formData.name) {
      alert(`name is required`);
      return;
    }

    if (!this.formData.value) {
      alert(`value is required`);
      return;
    }

    this.dialogRef.close(this.formData);
  }

  public onCancel() {
    this.dialogRef.close();
  }
}

export interface FormDialogData {
  title: string;
  resolveLabel?: string;
  formData?: FormData;
}
