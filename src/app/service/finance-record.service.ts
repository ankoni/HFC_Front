import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateFinanceRecord, FinanceTableData} from '../component/content/finance-table/finance-table.component';
import {FilterData} from '../component/common/filter-form/filter-form.component';

@Injectable({
  providedIn: 'root'
})
export class FinanceRecordService {

  constructor(
    private http: HttpClient
  ) { }

  getAllFinanceUserRecords(filter: FilterData[]): Observable<FinanceTableData[]> {
    return this.http.post<FinanceTableData[]>('rest/finance/record/user', filter);
  }

  getUserFinanceRecordById(recordId: string): Observable<FinanceTableData> {
    return this.http.get<FinanceTableData>(`rest/finance/record/${recordId}/user`);
  }

  createUserFinanceRecord(data: CreateFinanceRecord): Observable<FinanceTableData[]> {
    return this.http.put<FinanceTableData[]>('rest/finance/record/user/create', data);
  }

  deleteUserFinanceRecord(id: string): Observable<FinanceTableData[]> {
    return this.http.post<FinanceTableData[]>(`rest/finance/record/user/delete/${id}`, null);
  }

  editUserFinanceRecord(id: string, data: FinanceTableData): Observable<FinanceTableData[]> {
    return this.http.post<FinanceTableData[]>(`rest/finance/record/user/edit/${id}`, data);
  }
}
