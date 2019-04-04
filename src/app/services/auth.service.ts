import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

export interface ILogin {
  login: string;
  password: string;
}
export interface ILoginResponse {
  auth: boolean;
  login: string;
  id: string;
  user_title: string;
  msg: string;
}
@Injectable()
export class AuthService {

  constructor(
    public http: HttpClient, 
    public api: ApiService, 
    private router: Router,
    ) {
      console.log('AUTH SERVICE', this);
    }
  private isLoggedSuccess = false;
  private currentAuthorizedLogin: string = null;

  public login(login: ILogin) {
    if (login && login.login && login.password) {

      const api: string = this.api.getApi();
      this.http.get(api + 'enter.php', {
        params: {
          login: login.login,
          password: login.password
        }
      }
      
      )
        .subscribe((response: ILoginResponse) => {
      
          if (response) {
            this.isLoggedSuccess = response.auth;
            this.currentAuthorizedLogin = response && response.login;
          }
          if (response.auth) {
            this.router.navigate(['dashboard', response.login]);
          }
        },
          (e) => {
            console.log('loginError: ', e);
          });
    }
  }

  public logout(){
    this.isLoggedSuccess = false;
    this.currentAuthorizedLogin = null;
    this.router.navigate(['login']);
  }

  public isAuthorized(): boolean {
    return this.isLoggedSuccess;
  }
  public authorizedAs(): string {
    return this.currentAuthorizedLogin;
  }
}
