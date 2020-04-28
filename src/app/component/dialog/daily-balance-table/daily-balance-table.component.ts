import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountService} from '../../../service/account.service';
import {MatPaginator} from '@angular/material';

export class DailyBalanceRow {
  name: string;
  balance: number;
}
export interface DailyBalanceTotal {
  rows: DailyBalanceRow[];
  date: Date | string;
  total?: number;
}

@Component({
  selector: 'app-daily-balance-table',
  templateUrl: './daily-balance-table.component.html',
  styleUrls: ['./daily-balance-table.component.scss', '../../../app.component.scss']
})
export class DailyBalanceTableComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dailyBalanceDataTable: any[];
  tableData: any[];
  constructor(
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.accountService.getUserDailyBalance().subscribe(data => {
      this.dailyBalanceDataTable = [];
      if (data && Object.entries(data).length > 0) {
        for (const [key, value] of Object.entries(data)) {
          this.dailyBalanceDataTable.push({
            rows: value,
            date: key,
            // @ts-ignore
            total: this.getTotalBalance(value)
          });
        }

        this.paginator.length = this.dailyBalanceDataTable.length;
        let from = this.paginator.pageIndex * this.paginator.pageSize;
        this.tableData = this.dailyBalanceDataTable.slice(from, from + this.paginator.pageSize);
        this.paginator.page.subscribe(page => {
          from = page.pageIndex * page.pageSize;
          console.log(page);
          this.tableData = this.dailyBalanceDataTable.slice(from, from + page.pageSize);
        });
      }
    }, error => {
      console.log(error);
    });
  }

  getTotalBalance(rows: any[]): number {
    let total = 0;
    rows.forEach(it => {
      total += it.balance;
    });
    return total;
  }
}
