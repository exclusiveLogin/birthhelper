import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface ISecure {
  user: string;
  token: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor( private router: Router) { }
  private token = '72b4e261-bf20-4a72-9e47-ade621aba648';

  public isAuthorized() {
    const secureData = localStorage.getItem('bh_secure');
    if (! secureData) { return false; }

    const secure: ISecure = JSON.parse(secureData);
    return this.token === secure.token;
  }

  public logout() {
    localStorage.setItem('bh_secure', JSON.stringify({}));
    this.router.navigate(['/admin/non']);
  }
}
