import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FinanceTableData} from '../finance-table/finance-table.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {TableEditFormComponent} from '../../common/table-edit-form/table-edit-form.component';

@Component({
  selector: 'app-finance-record-edit',
  templateUrl: '../../common/table-edit-form/table-edit-form.component.html'
})
export class FinanceRecordEditComponent extends TableEditFormComponent implements OnInit, OnChanges {

  editForm: FormGroup;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    super(dialog);
  }

  ngOnInit() {
    super.ngOnInit();
    this.formTitle = `Запись от ${this.transform(this.openRow.date, 'dd.MM.yyyy')}
      <div class="mat-small">Дата создания: ${this.transform(this.openRow.loadDate, 'dd.MM.yyyy')}</div>`;
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      amount: new FormControl(this.openRow.amount, Validators.required),
      category: new FormControl(this.openRow.category.id, Validators.required),
      account: new FormControl(this.openRow.account.id, Validators.required),
      description: new FormControl(this.openRow.description, null)
    });

    this.readonly = !this.canEdit(this.openRow);
  }

  canEdit(row: FinanceTableData) {
    const weekAgoDate = new Date();
    weekAgoDate.setDate(weekAgoDate.getDate() - 7);
    const openRowDate = new Date(row.date);
    return openRowDate.getTime() > weekAgoDate.getTime();
  }
}
