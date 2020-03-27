import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserCategory} from '../model/user-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
  ) { }

  getUserCategory(): Observable<UserCategory[]> {
    return this.http.get<any>('rest/category/user/');
  }

  createUserCategory(parentCategoryId: string, data: UserCategory): Observable<UserCategory> {
    return this.http.put<UserCategory>(`rest/category/user/${parentCategoryId}/create`, data);
  }

  editUserCategory(categoryId: string, data: UserCategory): Observable<UserCategory> {
    return this.http.post<UserCategory>(`rest/category/user/${categoryId}/edit`, data);
  }
  deleteUserCategory(categoryId: string, data: UserCategory): Observable<UserCategory[]> {
    return this.http.post<UserCategory[]>(`rest/category/user/${categoryId}/delete`, data);
  }
}
