import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FinanceTableData} from '../../content/finance-table/finance-table.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {FieldType} from '../../../model/field-type.enum';
import {FieldForm} from '../field-form';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-table-edit-form',
  templateUrl: './table-edit-form.component.html',
  styleUrls: ['./table-edit-form.component.scss']
})
export class TableEditFormComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() openRow: any;
  @Input() readonly: boolean;
  @Input() deleteRecord: (element: any) => void;
  @Input() editRecord: (editData: FormGroup, row: FinanceTableData) => void;
  @Input() formFields: FieldForm[];

  FieldType = FieldType;
  editForm: FormGroup;
  data: any[];
  protected formTitle: string;
  constructor(
    public dialog: MatDialog
  ) {
    this.formTitle = this.title ? this.title : this.formTitle;
  }

  ngOnInit() {
    this.data = this.openRow;
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('openRow')) {
      this.data = this.openRow;
      this.initForm();
    }
  }

  initForm() {
  }

  deleteFinanceRecord(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      height: '200px',
      data: {
        message: 'Вы уверены?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRecord(element);
      }
    });
  }

  edit(editForm: FormGroup, row: FinanceTableData) {
    if (editForm.valid) {
      this.editRecord(editForm, row);
    }
  }

  resetForm() {
    this.openRow = this.data;
    this.initForm();
  }

  transform(value: any, pattern: string = 'mediumDate'): any {
    const datePipe: DatePipe = new DatePipe('en-US');
    return datePipe.transform(value, pattern);
  }

}
