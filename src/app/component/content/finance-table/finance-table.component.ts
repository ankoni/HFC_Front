import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {FinanceRecordService} from '../../../service/finance-record.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateFinanceRecordDialogComponent} from '../../dialog/create-finance-record-dialog/create-finance-record-dialog.component';
import {IdNameObj} from '../../common/id-name-obj';

export interface FinanceTableData {
  id: string;
  account: string;
  amount: number;
  category: string;
  date: Date;
  loadDate: Date;
}

export class CreateFinanceRecord {
  amount: number;
  category: IdNameObj;
  account: IdNameObj;
  recordDate: Date;
}
@Component({
  selector: 'app-finance-table',
  templateUrl: './finance-table.component.html',
  styleUrls: ['./finance-table.component.scss']
})
export class FinanceTableComponent implements OnInit {

  columnsToDisplay = ['category', 'amount', 'account', 'date'];
  recordData: FinanceTableData[] = [];
  dataSource = new MatTableDataSource<FinanceTableData>(this.recordData);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private financeRecordService: FinanceRecordService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.financeRecordService.getAllFinanceUserRecords().subscribe(data => {
      this.recordData = data;
      this.dataSource =  new MatTableDataSource<FinanceTableData>(this.recordData);
    });
    this.dataSource.paginator = this.paginator;
  }

  addRecord() {
    this.dialog.open(CreateFinanceRecordDialogComponent, {
      width: '400px',
      height: '400px'
    }).afterClosed().subscribe((record: CreateFinanceRecord ) => {
      if (record) {
        const newRecord: CreateFinanceRecord = {
          amount: record.amount,
          category: record.category,
          account: record.account,
          recordDate: record.recordDate
        };
        this.financeRecordService.createUserFinanceRecord(newRecord).subscribe(data => {
          console.log(data);
        }, error => {
          console.log(error);
        });
        console.log(newRecord);
      }
    });
  }

}
