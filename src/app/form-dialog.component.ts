import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { FormData, FormDataControls } from '../models/form-data';

@Component({
  selector: 'form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css'],
})
export class FormDialogComponent {
  title: string;
  resolveLabel: string;

  originalData: FormData;
  dialogForm: FormGroup<FormDataControls>;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent, Partial<FormData>>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {
    this.title = data.title || 'Form Dialog';
    this.resolveLabel = data.resolveLabel || 'Resolve';

    this.originalData = data.formData;

    this.dialogForm = new FormGroup({
      key: new FormControl(data.formData?.key, [Validators.required]),
      name: new FormControl(data.formData?.name, [Validators.required]),
      value: new FormControl(data.formData?.value, [Validators.required]),
      otherData: new FormControl(data.formData?.otherData),
    });
  }

  get dialogControls() {
    return this.dialogForm.controls;
  }

  get formDisabled(): boolean {
    if (!this.dialogForm.dirty) {
      return !this.dialogForm.dirty;
    }

    if (this.originalData) {
      return !(
        this.dialogControls.key.value !== this.originalData.key ||
        this.dialogControls.name.value !== this.originalData.name ||
        this.dialogControls.value.value !== this.originalData.value ||
        this.dialogControls.otherData.value !== this.originalData.otherData
      );
    }
  }

  onResolve() {
    if (this.dialogForm.invalid) {
      this.dialogForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.dialogForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}

export interface FormDialogData {
  title: string;
  resolveLabel?: string;
  formData?: FormData;
}
