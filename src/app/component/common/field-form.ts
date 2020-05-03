import {FormControl} from '@angular/forms';
import {InputType} from './input-type';
import {FieldType} from '../../model/field-type.enum';
import {IdNameObj} from './id-name-obj';

export class FieldForm {
  name: string;
  label: string;
  type: FieldType;
  readonly?: boolean;
  dataForSelect?: IdNameObj[];
}
