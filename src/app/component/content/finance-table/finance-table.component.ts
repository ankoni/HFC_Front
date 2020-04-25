import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {FinanceRecordService} from '../../../service/finance-record.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateFinanceRecordDialogComponent} from '../../dialog/create-finance-record-dialog/create-finance-record-dialog.component';
import {IdNameObj} from '../../common/id-name-obj';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../../service/category.service';
import {AccountService} from '../../../service/account.service';
import {UpdateBalanceService} from '../../../service/update-balance.service';

export interface FinanceTableData {
  id: string;
  account: IdNameObj;
  amount: number;
  category: IdNameObj;
  description: string;
  date: Date;
  loadDate: Date;
}

export class CreateFinanceRecord {
  amount: number;
  category: IdNameObj;
  account: IdNameObj;
  recordDate: Date;
  description: string;
  changeAccountBalance: boolean;
}
@Component({
  selector: 'app-finance-table',
  templateUrl: './finance-table.component.html',
  styleUrls: ['./finance-table.component.scss']
})
export class FinanceTableComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('matFinanceTable', {static: false}) table;
  @ViewChild('recordDrawer', {static: true}) financeDataDrawer;

  openRow: FinanceTableData;
  columnsToDisplay = ['category', 'amount', 'account', 'date'];
  recordData: FinanceTableData[] = [];
  dataSource: MatTableDataSource<FinanceTableData>;
  editForm: FormGroup;

  categories: IdNameObj[] = [];
  accounts: IdNameObj[] = [];

  constructor(
    private financeRecordService: FinanceRecordService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private updateBalanceService: UpdateBalanceService
  ) { }

  ngOnInit() {
    this.financeRecordService.getAllFinanceUserRecords().subscribe(data => {
      this.recordData = data;
      this.dataSource = new MatTableDataSource<FinanceTableData>(this.recordData);
      this.dataSource.paginator = this.paginator;
    });

    this.categoryService.getUserCategory().subscribe(data => {
      data.forEach(category => {
        this.categories.push({id: category.id, name: category.name});
        if (category.children) {
          category.children.forEach(child => {
            this.categories.push({id: child.id, name: child.name + ' (' + category.name + ')'});
          });
        }
      });
    });

    this.accountService.getAccountsByUserId().subscribe(data => {
      data.forEach(account => {
        this.accounts.push({id: account.id, name: account.name});
      });
    });
  }

  addRecord() {
    this.dialog.open(CreateFinanceRecordDialogComponent, {
      width: '400px',
      height: '500px',
      data: {
        accounts: this.accounts,
        categories: this.categories
      }
    }).afterClosed().subscribe((record: CreateFinanceRecord ) => {
      if (record) {
        const newRecord: CreateFinanceRecord = {
          amount: record.amount,
          category: record.category,
          account: record.account,
          recordDate: record.recordDate,
          description: record.description,
          changeAccountBalance: record.changeAccountBalance
        };
        this.financeRecordService.createUserFinanceRecord(newRecord).subscribe(data => {
          this.recordData = data;
          this.dataSource = new MatTableDataSource<FinanceTableData>(this.recordData);
          this.table.renderRows();
        }, error => {
          console.log(error);
        });
        this.updateBalanceService.updateBalance();
      }
    });
  }

  showDeleteColumn() {
    this.columnsToDisplay.push('action');
  }

  hideActionColumn() {
    this.columnsToDisplay.splice(-1, 1);
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
        this.financeRecordService.deleteUserFinanceRecord(element.id).subscribe(data => {
          this.recordData = data;
          this.dataSource = new MatTableDataSource<FinanceTableData>(this.recordData);
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        });
        this.updateBalanceService.updateBalance();
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
      this.financeRecordService.editUserFinanceRecord(row.id, editData).subscribe(data => {
        this.recordData = data;
        this.initEditForm(editData);
        this.snackBar.open('Данные успешно изменены', 'Записи', {
          duration: 2000,
        });
        this.dataSource = new MatTableDataSource<FinanceTableData>(this.recordData);
        this.table.renderRows();
      }, error => {
        console.log(error);
      });

      this.updateBalanceService.updateBalance();
    }
  }

  openDrawer(row: any) {
    if (this.openRow === row && this.financeDataDrawer.opened) {
      this.financeDataDrawer.close();
    } else {
      this.openRow = row;
      this.initEditForm(row);
      this.financeDataDrawer.open();
    }
  }

  initEditForm(row: any) {
    this.editForm = this.formBuilder.group({
      amount: new FormControl(row.amount, Validators.required),
      category: new FormControl(row.category.id, Validators.required),
      account: new FormControl(row.account.id, Validators.required),
      description: new FormControl(row.description, null)
    });
  }


  canEdit(row: FinanceTableData) {
    const weekAgoDate = new Date();
    weekAgoDate.setDate(weekAgoDate.getDate() - 7);
    const openRowDate = new Date(row.date);
    return openRowDate.getTime() > weekAgoDate.getTime();
  }
}
