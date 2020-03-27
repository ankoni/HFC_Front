import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EditUserDto, UserData, UserRegDto} from '../model/user-data';
import {AuthData} from '../component/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {
  }

  getUserData(): Observable<UserData> {
    return this.http.get<UserData>('/rest/user');
  }

  editUserData(id: string, data: EditUserDto) {
    return this.http.post(`rest/user/${id}`, data);
  }

  registration(data: UserRegDto): Observable<AuthData> {
    return this.http.put<AuthData>('rest/user/create', data);
  }
}
