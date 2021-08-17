import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/internal/observable/of';
import {map, switchMap} from 'rxjs/operators';
import {RestService} from '../../services/rest.service';

interface ISecure {
    user: string;
    token: string;
}

export interface SessionResponse {
    // user id
    id: number;
    auth: boolean;
    token: string;
    login?: string;
}

export interface UserRoleSrc {
    id: number;
    slug: UserRole;
    title: string;
    description: string;
    rank: number;
    datetime_create: string;
    datetime_update: string;
}

export type UserRole = 'master' | 'admin' | 'moderator' | 'user' | 'guest';

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(
        private router: Router,
        private rest: RestService
    ) {

    }

    private token = '72b4e261-bf20-4a72-9e47-ade621aba648';
    private role: UserRole;

    token$: Observable<string> = of(this.token).pipe(
        switchMap((token) => token ? of(token) : this.getTokenFromLS$()),
        switchMap((token) => token ? of(token) : this.createGuestToken$()),
    );

    createGuestToken$(): Observable<string> {
        return this.rest.createGuestToken();
    }

    createUserToken(login: string, password: string): Observable<string> {
        return this.rest.createUserToken(login, password);
    }

    getTokenFromLS$(): Observable<string> {
        const secureData = localStorage.getItem('bh_secure');
        return of(secureData);
    }

    public isAuthorized() {
        const secureData = localStorage.getItem('bh_secure');
        if (!secureData) {
            return false;
        }

        const secure: ISecure = JSON.parse(secureData);
        return this.token === secure.token;
    }

    public isAuthorized$(): Observable<boolean> {
        return this.token$.pipe(map(token => !!token));
    }

    public logout() {
        localStorage.setItem('bh_secure', JSON.stringify({}));
        this.router.navigate(['/admin/non']);
    }
}
