import { Injectable } from '@angular/core';

interface ISecure {
  user: string,
  token: string
}
@Injectable()
export class AuthService {

  constructor() { }
  private token = '72b4e261-bf20-4a72-9e47-ade621aba648';

  public isAuthorized(){
    let secureData = localStorage.getItem('bh_secure');
    if(! secureData) return false;

    let secure: ISecure = JSON.parse(secureData);
    return this.token === secure.token;
  }
}
