import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RestEndpoint } from '../../constants/rest-endpoint.constants';
import { LoginResponse } from '../../types/login-respose.type';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    return this.http
      .post<LoginResponse>(RestEndpoint.account.loginUser, {
        email,
        password,
      })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.name);
        })
      );
  }

  public signup(name: string, email: string, password: string): Observable<any> {
    return this.http
      .post<LoginResponse>(RestEndpoint.account.registerUser, {
        name,
        email,
        password,
      })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.name);
        })
      );
  }
}
