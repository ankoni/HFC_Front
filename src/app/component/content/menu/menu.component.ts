import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {AuthService} from '../../../service/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {UserSettingComponent} from '../../user-setting/user-setting.component';
import {DailyBalanceTableComponent} from '../../dialog/daily-balance-table/daily-balance-table.component';
import {AccountService} from '../../../service/account.service';
import {UpdateBalanceService} from '../../../service/update-balance.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() login: string;
  account: number;
  accountSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private updateBalanceService: UpdateBalanceService
  ) {
    this.accountSub = updateBalanceService.totalBalance$.subscribe(
      balance => {
        this.account = balance;
      });
  }

  ngOnInit() {
    this.getTotalBalance();
  }

  getTotalBalance() {
    this.accountService.getUserTotalBalance().subscribe(total => {
      this.account = total;
    }, error => {
      console.log(error);
    });
  }

  logout() {
    this.authService.logout().subscribe(s => {
      this.authService.isAuth = false;
      console.log('logout success');
      this.router.navigate(['login']);
    }, error => {
      console.log('something was wrong');
    });
  }

  openUserSetting() {
    const dialogRef = this.dialog.open(UserSettingComponent, {
      height: '550px',
      width: '900px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDailyBalanceTableDialog() {
    const dialogRef = this.dialog.open(DailyBalanceTableComponent, {
      height: '500px',
      width: '600px'
    });
  }

}
