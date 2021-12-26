import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../modules/auth-module/auth.service';
import {map, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthUserGuard implements CanActivate, CanLoad {

    constructor(
        private auth: AuthService,
        private router: Router
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.isAuthorizedAs$.pipe(
            map(role => role !== 'guest'),
            tap(access => {
                if (!access) {
                    this.router.navigate(['/auth'], {queryParams: {url: location.pathname}}).then();
                }
            }));
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.auth.isAuthorizedAs$.pipe(
            map(role => role !== 'guest'),
            tap(access => {
                if (!access) {
                    this.router.navigate(['/auth'], {queryParams: {url: location.pathname}}).then();
                }
            }));
    }
}
