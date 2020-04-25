import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateBalanceService {
  constructor(private accountService: AccountService) {
  }

  private totalBalanceSource = new Subject<number>();
  totalBalance$ = this.totalBalanceSource.asObservable();

  updateBalance() {
    setTimeout(() => {
      this.accountService.getUserTotalBalance().subscribe(total => {
        this.totalBalanceSource.next(total);
      }, error => {
        console.log(error);
      });
    }, 5000);

  }
}

