import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/internal/observable/of';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {RestService, UserRoleSrc} from '../../services/rest.service';
import {User} from '../../models/user.interface';
import {merge} from 'rxjs/internal/observable/merge';
import {Subject} from 'rxjs/Subject';

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

export type UserRole = 'master' | 'admin' | 'moderator' | 'user' | 'guest';

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(
        private router: Router,
        private rest: RestService
    ) {

    }


    reset$ = new Subject<null>();
    creds$ = new Subject<{ login: string, password: string }>();
    userToken$ = this.creds$.pipe(switchMap(creds => this.createUserToken(creds.login, creds.password)));

    private token: string = null;

    token$: Observable<string> = merge(of(this.token), this.userToken$, this.reset$).pipe(
        switchMap((token) => token ? of(token) : this.getTokenFromLS$()),
        switchMap((token) => token ? of(token) : this.createGuestToken$()),
        tap(token => this.token = token),
        shareReplay(1),
    );

    role$: Observable<UserRoleSrc> = this.token$.pipe(
        switchMap(token => token ? this.getCurrentRole() : of(null)),
        shareReplay(1),
    );

    user$: Observable<User> = this.token$.pipe(
        switchMap(token => token ? this.getCurrentUser() : of(null)),
        shareReplay(1),
    );

    isAuthorizedAs$: Observable<UserRole> = this.role$.pipe(map(role => role?.slug || null));

    createGuestToken$(): Observable<string> {
        return this.rest.createGuestToken();
    }

    getCurrentUser(): Observable<User> {
        return this.rest.getUser();
    }

    getCurrentRole(): Observable<UserRoleSrc> {
        return this.rest.getUserRole();
    }

    login(login: string, password: string) {
        this.creds$.next({login, password});
    }

    logout(): void {
        this.clearLSToken();
        this.reset$.next();
    }

    createUserToken(login: string, password: string): Observable<string> {
        return this.rest.createUserToken(login, password);
    }

    clearLSToken(): void {
        localStorage.removeItem('bh_secure');
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
}
