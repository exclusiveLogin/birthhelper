import {Injectable} from '@angular/core';
import {Observable, of, pipe, Subject, throwError} from 'rxjs';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {MonoTypeOperatorFunction} from 'rxjs/interfaces';
import {NotifierService} from '../notifier/notifier.service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService {

    public reseterToken$: Subject<null>;
    private _token = new Subject<string>();
    public token$: Observable<string> = this._token.pipe(shareReplay(1));

    constructor(private notifier: NotifierService, private toastr: ToastrService) {
        this.reseterToken$ = new Subject<null>();
        console.log('InterceptorService', this);
    }

    tokenInjector(token: string): void {
        console.log('tokenInjector', token);
        this._token.next(token);
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
