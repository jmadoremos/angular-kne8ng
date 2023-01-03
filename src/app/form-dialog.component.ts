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
  title: string = 'Form Dialog';
  resolveLabel: string = 'Resolve';
  originalData: FormData = null;

  dialogForm: FormGroup<FormDataControls> = new FormGroup({
    key: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    otherData: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent, Partial<FormData>>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {
    this.title = data.title ?? this.title;
    this.resolveLabel = data.resolveLabel ?? this.resolveLabel;

    if (data.formData) {
      this.originalData = data.formData;

      this.dialogControls.key.setValue(data.formData?.key);
      this.dialogControls.name.setValue(data.formData?.name);
      this.dialogControls.value.setValue(data.formData?.value);
      this.dialogControls.otherData.setValue(data.formData?.otherData);
    }
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
