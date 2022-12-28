import { FormControl } from '@angular/forms';

export interface FormData {
  key: string;
  name: string;
  value: string;
  otherData: string;
}

export interface FormDataControls {
  key: FormControl<string>;
  name: FormControl<string>;
  value: FormControl<string>;
  otherData: FormControl<string>;
}
