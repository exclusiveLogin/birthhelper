import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MonoTypeOperatorFunction} from 'rxjs/interfaces';
import {pipe} from 'rxjs/internal-compatibility';
import {of} from 'rxjs/internal/observable/of';
import {NotifierService} from '../notifier/notifier.service';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService {

    public reseterToken$: Subject<null>;
    public token$: Observable<string>;

    constructor(private notifier: NotifierService) {
        this.token$ = new Subject<string>();
        this.reseterToken$ = new Subject<null>();
    }

    tokenInjector(token$: Observable<string>): void {
        console.log('tokenInjector');
        this.token$ = token$;
    }

    interceptor(): MonoTypeOperatorFunction<any> {
        return pipe(
            catchError((err) => {
                console.log('HTTP INTERCEPTOR ERROR', err);
                const error: string = err?.error?.error || err.statusText || 'Unknown error';
                this.notifier.setMessageTime(error, 'authStr');
                if (err.status === 403) {
                    setTimeout(() => this.reseterToken$.next(null), 100);
                }
                if (err.status === 500) {
                    return throwError(err.error);
                }
                return of(err);
            }),
            map(r => r?.body ?? r?.error ?? null),
        );
    }
}
