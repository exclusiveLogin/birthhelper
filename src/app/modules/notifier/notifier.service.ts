import {Injectable} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

const repoSub = {
    authStr: new Subject<string>(),
};

const repo = {
    authStr: repoSub.authStr.pipe(shareReplay(1)),
};

export type NotyRepoType = keyof typeof repo;

@Injectable({
    providedIn: 'root'
})
export class NotifierService {

    constructor() {
    }

    setMessageTime(msg: string, key: NotyRepoType, delay = 5000): void {
        console.log('setMessageTime : ', msg );
        const target = repoSub[key];
        target.next(msg);
        setTimeout(() => target.next(null), delay);
    }

    getMessageStream(key: NotyRepoType): Observable<string> {
        return repo[key];
    }
}
