import {Injectable} from '@angular/core';
import {Observable, of, pipe, Subject, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MonoTypeOperatorFunction} from 'rxjs/interfaces';
import {NotifierService} from '../notifier/notifier.service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService {

    public reseterToken$: Subject<null>;
    public token$: Observable<string>;

    constructor(private notifier: NotifierService, private toastr: ToastrService) {
        this.token$ = new Subject<string>();
        this.reseterToken$ = new Subject<null>();
    }

    tokenInjector(token$: Observable<string>): void {
        this.token$ = token$;
    }

    interceptor(): MonoTypeOperatorFunction<any> {
        return pipe(
            catchError((err) => {
                const error: string = err?.error?.error || err.statusText || 'Unknown error';
                this.notifier.setMessageTime(error, 'authStr');
                if (err.status === 403) {
                    this.toastr.error('Ошибка доступа при выполнении: ' + error, `[403] ${err.status}`);
                    setTimeout(() => this.reseterToken$.next(null), 100);
                }
                if (err.status === 401) {
                    this.toastr.error('Ошибка доступа при выполнении: ' + error, `[401] ${err.status}`);
                    localStorage.removeItem('bh_secure_token');
                    setTimeout(() => this.reseterToken$.next(null), 100);
                }
                if (err.status === 500) {
                    this.toastr.error('Ошибка доступа при выполнении: ' + error, `[500] ${err.status}`);
                    return throwError(err.error);
                }
                return throwError(err);
            }),
            // map(r => r?.body ?? r?.error ?? null),
        );
    }
}
