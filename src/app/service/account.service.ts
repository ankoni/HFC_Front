import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccountTableData} from '../component/user-setting/user-account-setting/user-account-setting.component';
import {DailyBalanceRow, DailyBalanceTotal} from '../component/dialog/daily-balance-table/daily-balance-table.component';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  totalBalance: number;

  constructor(
    private http: HttpClient
  ) { }

  getAccountsByUserId(): Observable<UserAccountTableData[]> {
    return this.http.get<UserAccountTableData[]>(`rest/account/user/`);
  }

  createUserAccount(data: UserAccountTableData): Observable<UserAccountTableData[]> {
    return this.http.post<UserAccountTableData[]>('rest/account/user/create', data);
  }

  editUserAccount(data: UserAccountTableData): Observable<UserAccountTableData[]> {
    return this.http.post<UserAccountTableData[]>('rest/account/user/edit', data);
  }

  deleteUserAccount(id: string): Observable<UserAccountTableData[]> {
    return this.http.post<UserAccountTableData[]>(`rest/account/user/delete/${id}`, null);
  }

  getAccountById(id: string): Observable<UserAccountTableData> {
    return this.http.get<UserAccountTableData>(`rest/account/${id}`);
  }

  getUserDailyBalance(): Observable<Map<Date, DailyBalanceRow[]>[]> {
    return this.http.get<Map<Date, DailyBalanceRow[]>[]>('rest/account/user/dailyBalance');
  }

  getUserTotalBalance(): Observable<number> {
    return this.http.get<number>('rest/account/user/totalBalance');
  }
}
