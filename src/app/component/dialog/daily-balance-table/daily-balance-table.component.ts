import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../../service/account.service';

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
  dailyBalanceDataTable: any[];
  displayedColumns: string[] = ['rows', 'total', 'date'];
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
        console.log(this.dailyBalanceDataTable);
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
