import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginComponent, AuthData} from '../component/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {
  }

  checkAuth(): Observable<any> {
    return this.http.get('/rest/auth/check');
  }

  setAuth(data: AuthData): Observable<any> {
    return this.http.post<any>('/rest/auth/login', data);
  }

  logout(): Observable<any> {
    return this.http.post('rest/auth/logout', null);
  }

}
