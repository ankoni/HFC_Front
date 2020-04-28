import {Component, Input, OnInit} from '@angular/core';
import {AccountService} from '../../../service/account.service';
import {UpdateBalanceService} from '../../../service/update-balance.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit {

  public chartType = 'line';

  chartDatasets: Array<any>;

  chartLabels: Array<any> = [];

  chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(200,99,132, 0)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    }
  ];

  chartOptions: any = {
    responsive: true
  };
  constructor(
    private accountService: AccountService,
    private updateBalanceService: UpdateBalanceService
  ) { }

  ngOnInit() {
    this.chartDatasets = [];
    const dates = [];
    const totalPoints = {
      data: [],
      label: 'Сумма'
    };
    const accountNames = [];
    const accountsData = [];
    this.accountService.getAccountsByUserId().subscribe(accounts => {
      accounts.forEach(it => {
        accountNames.push(it.name);
        accountsData.push({
          data: [],
          label: it.name
        });
        const color = this.randomColor();
        this.chartColors.push({
          backgroundColor: this.propColorToString(color, 0.1),
          borderColor: this.propColorToString(color, 1),
          borderWidth: 2
        });
      });

      this.accountService.getUserDailyBalance().subscribe(data => {
        if (data && Object.entries(data).length > 0) {
          for (const [key, value] of Object.entries(data).reverse()) {
            dates.push(formatDate(key, 'dd.MM.yyyy', 'en-US'));
            totalPoints.data.push(this.updateBalanceService.getTotalBalance(value));
            accountsData.forEach(account => {
              const rowIndex = value.findIndex(row => row.name === account.label);
              if (rowIndex === -1) {
                account.data.push(0);
              } else {
                account.data.push(value[rowIndex].balance);
              }
            });
          }

          this.chartLabels = dates;
          this.chartDatasets.push(totalPoints);
          accountsData.forEach(it => this.chartDatasets.push(it));
        }
      }, error => {
        console.log(error);
      });
    });
  }

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  randomColor() {
    const r = this.getRandom();
    const g = this.getRandom();
    const b = this.getRandom();
    return [r, g, b];
  }

  getRandom() {
    const c = Math.floor((Math.random() * 200));
    return c < 120 ? 120 : c;
  }

  propColorToString(color: any[], opacity: number) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
  }
}
