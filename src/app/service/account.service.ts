import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccountTableData} from '../component/user-setting/user-account-setting/user-account-setting.component';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) { }

  getAccountsByUserId(id: string): Observable<UserAccountTableData[]> {
    return this.http.get<UserAccountTableData[]>(`rest/account/user/${id}`);
  }

  updateUsersAccounts(id: string, data: UserAccountTableData[]): Observable<UserAccountTableData[]> {
    return this.http.put<UserAccountTableData[]>(`rest/account/user/${id}/update`, data);
  }
}
