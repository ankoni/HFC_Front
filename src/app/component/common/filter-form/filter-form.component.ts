import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbDropdownConfig, NgbDropdownMenu} from '@ng-bootstrap/ng-bootstrap';
import {IdNameObj} from '../id-name-obj';

export enum FilterType {
  EQUAL,
  LIKE,
  FROM,
  TO
}

export enum ValueType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  DATE = 'DATE'
}

export class FilterData {
  columnName: string;
  value: IdNameObj;
  conditionType: FilterType;
  valueType: ValueType;
}

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {

  @Input() categories: IdNameObj[] = [];
  @Input() accounts: IdNameObj[] = [];
  @Output() changeFilter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(NgbDropdownMenu, {static: false}) filterMenu: NgbDropdownMenu;
  filterForm: FormGroup;
  filterData: FilterData[];

  constructor(
    private formBuilder: FormBuilder,
    config: NgbDropdownConfig
  ) {
    config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.filterForm = this.formBuilder.group({
      category: new FormControl('', null),
      amount: this.formBuilder.group({
        from: new FormControl('', null),
        to: new FormControl('', null)
      }),
      account: new FormControl('', null),
      recordDate: this.formBuilder.group({
        from: new FormControl('', null),
        to: new FormControl('', null)
      })
    });
  }

  resetFilter() {
    this.initForm();
    this.filterForm.markAsDirty();
  }

  filter() {
    const values = this.filterForm.getRawValue();
    this.filterData = [];
    for (const [key, value] of Object.entries(values)) {
      const fieldValue: any = value;
      if (fieldValue) {
        if (fieldValue.from) {
          this.filterData.push({
            columnName: key,
            value: new IdNameObj({id: null, name: fieldValue.from}),
            conditionType: FilterType.FROM,
            valueType: this.getValueType(fieldValue.from)
          });
        }
        if (fieldValue.to) {
          this.filterData.push({
            columnName: key,
            value: new IdNameObj({id: null, name: fieldValue.to}),
            conditionType: FilterType.TO,
            valueType: this.getValueType(fieldValue.to)
          });
        }

        if (!fieldValue.from && !fieldValue.to && (typeof fieldValue === 'string' || fieldValue.id)) {
          const idNameObjValue: IdNameObj = {
            id: fieldValue.id ? fieldValue.id : null,
            name: fieldValue.name ? fieldValue.name : fieldValue.toString()
          };
          this.filterData.push({
            columnName: key,
            value: idNameObjValue,
            conditionType: FilterType.EQUAL,
            valueType: ValueType.STRING
          });
        }
      }
    }
    console.log(this.filterData);
    this.changeFilter.emit(this.filterData);
    this.closeMenu();
  }

  closeMenu() {
    this.filterMenu.dropdown.close();
  }

  getValueType(value: any) {
    return typeof value === 'number' ? ValueType.NUMBER : typeof value === 'string' ? ValueType.STRING : ValueType.DATE;
  }
}
