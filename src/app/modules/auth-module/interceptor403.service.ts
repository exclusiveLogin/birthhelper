import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {MonoTypeOperatorFunction} from 'rxjs/interfaces';
import {pipe} from 'rxjs/internal-compatibility';
import {of} from 'rxjs/internal/observable/of';
import {NotifierService} from '../notifier/notifier.service';

@Injectable({
    providedIn: 'root'
})
export class Interceptor403Service {

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

    interceptor403(): MonoTypeOperatorFunction<any> {
        return pipe(
            catchError((err) => {
                console.log('HTTP INTERCEPTOR ERROR', err);
                this.notifier.setMessageTime(err?.error?.error || err.statusText, 'authStr');
                if (err.status === 403) {
                    // this.reseterToken$.next(null);
                    setTimeout(() => this.reseterToken$.next(null), 5000);
                }
                return of(null);
            }),
            map(r => r?.body || null),
        );
    }
}
