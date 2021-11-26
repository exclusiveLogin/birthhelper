import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ISettingsParams, RestService} from './rest.service';
import {share, shareReplay, switchMap, take, tap} from 'rxjs/operators';

export interface IDictItem {
    id: number;
    name: string;
    title: string;
    icon?: string;
    comment?: string;
}

export interface IDict {
    dctKey: string;
    dict: IDictItem[];
}

const settingsParams: ISettingsParams = {
    mode: 'admin',
    segment: 'dict'
};

@Injectable({providedIn: 'root'})
export class DictService {

    constructor(
        private rest: RestService,
    ) {}

    private dictRepo: { [key: string]: IDictItem[] } = {};
    private dictStreams$: { [key: string]: Observable<IDictItem[]> } = {};

    getDictStream(name, page = 1): Observable<IDictItem[]> {
        const dict$ = this.rest.getDict(name, page)
            .pipe(
                tap(dict => this.dictRepo[name] = dict),
                tap(dict => delete this.dictStreams$[name]),
                shareReplay(1),
            );

        return of(null).pipe(switchMap(() => this.dictStreams$[name] ? this.dictStreams$[name] : (this.dictStreams$[name] = dict$)));
    }
    public getDict(name: string, page: number = 1): Observable<IDictItem[]> {

        return of(null).pipe(
            switchMap(() => this.dictRepo[name] ? of(this.dictRepo[name]) : this.getDictStream(name, page)),
            take(1),
        );
    }

    public resetDict(key?: string): void {
        if (key && this.dictRepo[key]) {
            delete this.dictRepo[key];
            return;
        }

        this.dictRepo = {};
    }
}
