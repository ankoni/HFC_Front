import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {FinanceRecordService} from '../../../service/finance-record.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateFinanceRecordDialogComponent} from '../../dialog/create-finance-record-dialog/create-finance-record-dialog.component';
import {IdNameObj} from '../../common/id-name-obj';
import {FormBuilder} from '@angular/forms';
import {CategoryService} from '../../../service/category.service';
import {AccountService} from '../../../service/account.service';
import {UpdateBalanceService} from '../../../service/update-balance.service';
import {FieldType} from '../../../model/field-type.enum';
import {TableDataComponent} from '../../common/table-data/table-data.component';

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
export class FinanceTableComponent extends TableDataComponent implements OnInit {

  tableTitle = 'Таблица финансов';

  columnsToDisplay = ['category', 'amount', 'account', 'date'];

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
  ) {
    super(dialog);
  }

  actionMenuList = [
    {name: 'Добавить', action: () => this.addRecord() }
  ];

  ngOnInit() {
    super.ngOnInit();
    this.accountService.getAccountsByUserId().subscribe(accounts => {
      accounts.forEach(account => {
        this.accounts.push({id: account.id, name: account.name});
      });

      this.categoryService.getUserCategory().subscribe(categories => {
        categories.forEach(category => {
          this.categories.push({id: category.id, name: category.name});
          if (category.children) {
            category.children.forEach(child => {
              this.categories.push({id: child.id, name: child.name + ' (' + category.name + ')'});
            });
          }
        });

        this.formFields = [
          {name: 'amount', label: 'Сумма', type: FieldType.BalanceInput},
          {name: 'account', label: 'Счет', type: FieldType.Select, dataForSelect: this.accounts},
          {name: 'category', label: 'Категория', type: FieldType.Select, dataForSelect: this.categories},
          {name: 'description', label: 'Примечание', type: FieldType.Textarea}
        ];

      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });
  }

  getDataTable(): void {
    this.financeRecordService.getAllFinanceUserRecords(this.filter).subscribe(data => {
      this.recordData = data;
      this.dataSource = new MatTableDataSource<FinanceTableData>(this.recordData);
      this.dataSource.paginator = this.paginator;
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
          this.getDataTable();
          this.table.renderRows();
          this.snackBar.open('Запись добавлена', 'Записи', {
            duration: 2000
          });
        }, error => {
          console.log(error);
        });
        this.updateBalanceService.updateBalance();
      }
    });
  }

  deleteRecord(element: FinanceTableData) {
    this.financeRecordService.deleteUserFinanceRecord(element.id).subscribe(data => {
      this.getDataTable();
      this.editRecordDataDrawer.close();
      this.snackBar.open('Запись удалена', 'Записи', {
        duration: 2000
      });
      this.table.renderRows();
    });
    this.updateBalanceService.updateBalance();
  }

  editRecord(editData: FinanceTableData, row: FinanceTableData) {
    this.financeRecordService.editUserFinanceRecord(row.id, editData).subscribe(data => {
      this.recordData = data;
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

  hideActionColumn() {
    this.columnsToDisplay.splice(-1, 1);
  }
}
