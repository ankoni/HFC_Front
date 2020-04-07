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
}
