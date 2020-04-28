import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FinanceTableData} from '../finance-table/finance-table.component';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {MatTableDataSource} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FinanceRecordService} from '../../../service/finance-record.service';
import {MatDialog} from '@angular/material/dialog';
import {IdNameObj} from '../../common/id-name-obj';

@Component({
  selector: 'app-finance-record-edit',
  templateUrl: './finance-record-edit.component.html',
  styleUrls: ['./finance-record-edit.component.scss']
})
export class FinanceRecordEditComponent implements OnInit, OnChanges {

  @Input() openRow: FinanceTableData;
  @Input() categories: IdNameObj[] = [];
  @Input() accounts: IdNameObj[] = [];
  @Input() deleteRecord: (element: any) => void;
  @Input() editRecord: (editData: FinanceTableData, row: FinanceTableData) => void;

  editForm: FormGroup;
  data: FinanceTableData;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
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
    this.editForm = this.formBuilder.group({
      amount: new FormControl(this.openRow.amount, Validators.required),
      category: new FormControl(this.openRow.category.id, Validators.required),
      account: new FormControl(this.openRow.account.id, Validators.required),
      description: new FormControl(this.openRow.description, null)
    });
  }

  canEdit(row: FinanceTableData) {
    const weekAgoDate = new Date();
    weekAgoDate.setDate(weekAgoDate.getDate() - 7);
    const openRowDate = new Date(row.date);
    return openRowDate.getTime() > weekAgoDate.getTime();
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
      const editData: FinanceTableData = {
        id: row.id,
        account: this.accounts.filter(it => it.id === editForm.get('account').value)[0],
        amount: editForm.get('amount').value,
        category: this.categories.filter(it => it.id === editForm.get('category').value)[0],
        description: editForm.get('description').value,
        date: row.date,
        loadDate: row.loadDate
      };
      this.editRecord(editData, row);
    }
  }

  resetForm() {
    this.openRow = this.data;
    this.initForm();
  }
}
