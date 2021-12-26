import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject, asyncScheduler, merge, of} from 'rxjs';
import {filter, map, shareReplay, switchMap, tap, throttleTime} from 'rxjs/operators';
import {RegistrationResponseSrc, RestService, UserRoleSrc} from '../../services/rest.service';
import {User} from '../../models/user.interface';
import {InterceptorService} from './interceptor.service';

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
        private interceptor: InterceptorService,
    ) {
        this.interceptor.tokenInjector(this.token$);
        this.token$.subscribe();
        this.user$.subscribe();
        this.role$.subscribe();
    }


    user: User;
    role: UserRoleSrc;
    urlToRedirect: string;

    updateUser$ = new Subject<null>();
    reset$ = this.interceptor.reseterToken$;

    onResetToken$ = this.reset$.pipe(
        throttleTime(2000, asyncScheduler, {leading: true, trailing: false}),
    );

    creds$ = new Subject<{ login: string, password: string }>();
    userToken$ = this.creds$.pipe(
        switchMap(creds => this.authorization(creds.login, creds.password)),
        filter((token: string) => !!token),
        tap(token => this.saveLSToken(token)),
    );

    private token: string = null;

    token$: Observable<string> = merge(of(this.token), this.userToken$, this.onResetToken$, this.updateUser$).pipe(
        switchMap((token) => token ? of(token) : this.getTokenFromLS$()),
        switchMap((token) => token ? of(token) : this.createGuestToken$()),
        tap(token => this.saveLSToken(token)),
        tap(token => this.token = token),
        shareReplay(1),
    );

    role$: Observable<UserRoleSrc> = this.token$.pipe(
        switchMap(token => token ? this.getCurrentRole() : of(null)),
        tap((token) => {
            if (this.urlToRedirect) {
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

    isAuthorizedAs$: Observable<UserRole> = this.role$.pipe(
        map(role => role?.slug || null),
    );

    onAdminAccess$: Observable<boolean> = this.isAuthorizedAs$.pipe(
        map(slug => slug && (slug === 'admin' || slug === 'master' || slug === 'moderator')),
        shareReplay(1),
    );

    onGuestAccess$: Observable<boolean> = this.isAuthorizedAs$.pipe(
        map(slug => !slug || slug === 'guest'),
        shareReplay(1),
    );

    onUserAccess$: Observable<boolean> = this.onGuestAccess$.pipe(
        map(r => !r),
        shareReplay(1),
    );

    createGuestToken$(): Observable<string> {
        return this.rest.createGuestToken();
    }

    getCurrentUser(): Observable<User> {
        return this.rest.getUser().pipe(
            map(data => new User(data)),
            tap(user => this.user = user)
        );
    }

    getCurrentRole(): Observable<UserRoleSrc> {
        return this.rest.getUserRole().pipe(
            tap(role => this.role = role),
        );
    }

    login(login: string, password: string, url: string) {
        this.creds$.next({login, password});
        this.urlToRedirect = url || '/';
    }

    logout(): void {
        this.rest.logout().subscribe(() => this.reset$.next());
    }

    logoutEverywhere(): void {
        this.rest.logout(true).subscribe(() => this.reset$.next());
    }

    registration(login: string, password: string): Observable<RegistrationResponseSrc> {
        return this.rest.createNewUser(login, password);
    }

    authorization(login: string, password: string): Observable<string> {
        return this.rest.authorization(login, password);
    }

    clearLSToken(): void {
        localStorage.removeItem('bh_secure_token');
    }

    saveLSToken(token: string): void {
        localStorage.setItem('bh_secure_token', token);
    }

    getTokenFromLS$(): Observable<string> {
        const secureData = localStorage.getItem('bh_secure_token');
        return secureData ? of(secureData) : of(null);
    }
}
