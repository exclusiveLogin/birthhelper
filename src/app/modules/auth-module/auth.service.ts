import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/internal/observable/of';
import {filter, map, publishBehavior, refCount, shareReplay, switchMap, tap} from 'rxjs/operators';
import {RestService, UserRoleSrc} from '../../services/rest.service';
import {User} from '../../models/user.interface';
import {merge} from 'rxjs/internal/observable/merge';
import {Subject} from 'rxjs/Subject';
import {Interceptor403Service} from './interceptor403.service';

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
        private rest: RestService,
        private interceptor: Interceptor403Service,
    ) {
        this.interceptor.tokenInjector(this.token$);
        this.token$.subscribe();
        this.user$.subscribe();
        this.role$.subscribe();
    }


    user: User;
    role: UserRoleSrc;
    urlToRedirect: string;
    reset$ = this.interceptor.reseterToken$;
    creds$ = new Subject<{ login: string, password: string }>();
    userToken$ = this.creds$.pipe(
        switchMap(creds => this.createUserToken(creds.login, creds.password)),
        tap(token => this.saveLSToken(token)),
        tap((tok) => console.log('userToken$ fire', tok)),
    );

    private token: string = null;

    token$: Observable<string> = merge(of(this.token), this.userToken$, this.reset$).pipe(
        tap((token) => console.log('token fire: ', token)),
        switchMap((token) => token ? of(token) : this.getTokenFromLS$()),
        tap((token) => console.log('getTokenFromLS$ fire: ', token)),
        switchMap((token) => token ? of(token) : this.createGuestToken$()),
        tap((token) => console.log('createGuestToken$ fire: ', token)),
        tap(token => this.token = token),
        tap((token) => console.log('token: ', token)),
        shareReplay(1),
    );

    role$: Observable<UserRoleSrc> = this.token$.pipe(
        switchMap(token => token ? this.getCurrentRole() : of(null)),
        tap((token) => {
            if (this.urlToRedirect) {
                console.log('redirect to ', this.urlToRedirect);
                location.pathname = this.urlToRedirect;
                this.urlToRedirect = null;
            }
        }),
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
        return this.rest.getUser().pipe(tap(user => this.user = user));
    }

    getCurrentRole(): Observable<UserRoleSrc> {
        return this.rest.getUserRole().pipe(tap(role => this.role = role));
    }

    login(login: string, password: string, url: string) {
        console.log('login ', login, password, url);
        this.creds$.next({login, password});
        this.urlToRedirect = url || null;
    }

    logout(): void {
        this.urlToRedirect = location.pathname;
        this.clearLSToken();
        this.reset$.next();
    }

    createUserToken(login: string, password: string): Observable<string> {
        console.log('createUserToken ', login, password);
        return this.rest.createUserToken(login, password);
    }

    clearLSToken(): void {
        localStorage.removeItem('bh_secure_token');
    }

    saveLSToken(token: string): void {
        localStorage.setItem('bh_secure_token', token);
    }

    getTokenFromLS$(): Observable<string> {
        const secureData = localStorage.getItem('bh_secure_token');
        return of(secureData);
    }
}
