import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FieldForm} from '../../common/field-form';
import {InputType} from '../../common/input-type';
import {CategoryService} from '../../../service/category.service';
import {AccountService} from '../../../service/account.service';
import {IdNameObj} from '../../common/id-name-obj';
import {UserCategory} from '../../../model/user-category';
import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {FinanceTableData} from '../../content/finance-table/finance-table.component';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-create-finance-record-dialog',
  templateUrl: './create-finance-record-dialog.component.html',
  styleUrls: ['./create-finance-record-dialog.component.scss']
})
export class CreateFinanceRecordDialogComponent implements OnInit {

  createForm: FormGroup;
  categories: IdNameObj[] = [];
  accounts: IdNameObj[] = [];
  maxDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<CreateFinanceRecordDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm = this.formBuilder.group(
      {
        amount: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required),
        account: new FormControl('', Validators.required),
        description: new FormControl('', null),
        recordDate: new FormControl(new Date(), Validators.required),
        changeAccountBalance: new FormControl(false, Validators.required),
      }
    );
  }

  ngOnInit() {
    this.accounts = this.data.accounts;
    this.categories = this.data.categories;
  }

  accept(form: FormGroup) {
    if (form.valid) {
      this.accountService.getAccountById(form.get('account').value.id).subscribe(account => {
        const accountCreateDate = new Date(account.create);
        const recordDate = new Date(form.get('recordDate').value);
        if (accountCreateDate.getFullYear() === recordDate.getFullYear()
          && accountCreateDate.getMonth() === recordDate.getMonth()
          && accountCreateDate.getDate() === recordDate.getDate()) {

          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            height: '200px',
            data: {
              message: 'Пересчитать баланс счета с учетом данной записи?'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              form.get('changeAccountBalance').setValue(true);
            }

            this.dialogRef.close(form.value);
          });
        } else if (new Date().getFullYear() === recordDate.getFullYear()
          && new Date().getMonth() === recordDate.getMonth()
          && new Date().getDate() === recordDate.getDate()) {
          form.get('changeAccountBalance').setValue(true);
          this.dialogRef.close(form.value);
        } else {
          this.dialogRef.close(form.value);
        }
      });
    }
  }

  getErrorMessage(field: AbstractControl) {
    if (field.touched) {
      if (field.errors) {
        if (field.errors.required) {
          return 'Это поле обязательно для заполнения';
        }
      }
    }
  }

  getError(field: AbstractControl) {
    if (field.touched) {
      return field.invalid;
    }
  }
}
