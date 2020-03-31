import {FormControl} from '@angular/forms';
import {InputType} from './input-type';

export class FieldForm {
  label: string;
  control: FormControl;
  type: InputType;
}
