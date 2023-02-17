import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { RestService } from "./rest.service";
import { shareReplay, switchMap, take, tap } from "rxjs/operators";

export interface IDictItem {
    id: number;
    name: string;
    title: string;
    slug?: string;
    icon?: string;
    bg_color?: string;
    comment?: string;
}

@Injectable({ providedIn: "root" })
export class DictionaryService {
    constructor(private rest: RestService) {
        console.log("DictionaryService", this);
    }

    private dictRepo: { [key: string]: IDictItem[] } = {};
    private dictStreams$: { [key: string]: Observable<IDictItem[]> } = {};

    getDictStream(
        name,
        filters: Record<string, string>,
        page = 1
    ): Observable<IDictItem[]> {
        if (this.dictStreams$[name]) {
            return this.dictStreams$[name];
        }

        const dict$ = this.rest.fetchDictionary(name, filters, page).pipe(
            tap((dict) => (this.dictRepo[name] = dict)),
            tap((dict) => delete this.dictStreams$[name]),
            shareReplay(1)
        );

        return (this.dictStreams$[name] = dict$);
    }
    public getDict(
        name: string,
        filters: Record<string, string>,
        page: number = 1
    ): Observable<IDictItem[]> {
        return this.rest.fetchDictionary(name, filters, page);
    }

    public resetDict(key?: string): void {
        if (key && this.dictRepo[key]) {
            delete this.dictRepo[key];
            return;
        }

        this.dictRepo = {};
    }
}
