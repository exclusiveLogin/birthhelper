import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpResponse} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {MonoTypeOperatorFunction} from 'rxjs/interfaces';
import {pipe} from 'rxjs/internal-compatibility';

@Injectable({
    providedIn: 'root'
})
export class Interceptor403Service {

    constructor() {
    }

    reseterToken$ = new Subject<null>();

    token$;

    tokenInjector(token$: Observable<string>): void {
        console.log('tokenInjector');
        this.token$ = token$;
    }

    interceptor403(): MonoTypeOperatorFunction<HttpResponse<any>> {
        return pipe(
            tap(r => console.log('HTTP INTERCEPTOR', r), r => console.log('HTTP INTERCEPTOR ERROR', r)),
            tap(r => {
                    if (r.status === 403) {
                        this.reseterToken$.next(null);
                    }
                },
                r => {
                    if (r.status === 403) {
                        this.reseterToken$.next(null);
                    }
                }),
            map(r => r.body),
        );
    }
}
