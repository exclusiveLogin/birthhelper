import {Injectable, SecurityContext} from '@angular/core';
import {RestService} from './rest.service';
import {Observable, of} from 'rxjs';
import {IImage} from '../Admin/Dashboard/Editor/components/image/image.component';
import {catchError, finalize, map, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {environment} from '@environments/environment';
import {MetaPhoto} from '../models/map-object.interface';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    cache: {[key: string]: Observable<ArrayBuffer>} = {};

    constructor(
        private rest: RestService,
        private sanitizer: DomSanitizer,
    ) {}
    checkCache(url: string): boolean {
        return (url in this.cache);
    }
    getCache(url: string): Observable<ArrayBuffer> {
        return this.cache[url];
    }
    saveCache(url, stream$: Observable<ArrayBuffer>): Observable<ArrayBuffer> {
        return this.cache[url] = stream$.pipe(shareReplay(1));
    }
    getImage(image: IImage | MetaPhoto): Observable<SafeUrl> {
        const mainURL: string = image?.aws ?? `${environment.static}${image?.folder ?? ''}/${image?.filename || 'noimage'}`;
        const fallbackURL = `${environment.static}${image?.folder ?? ''}/${image?.filename || 'noimage'}`;
        const staticBlank = `${environment.static}/noimage`;
        return of(mainURL).pipe(
            switchMap((url => this.checkCache(url) ? this.getCache(url) : this.saveCache(url, this.rest.getRaw(url)))),
            catchError(err =>
                this.checkCache(fallbackURL) ? this.getCache(fallbackURL) : this.saveCache(fallbackURL, this.rest.getRaw(fallbackURL))),
            catchError(err =>
                this.checkCache(staticBlank) ? this.getCache(staticBlank) : this.saveCache(staticBlank, this.rest.getRaw(staticBlank))),
            map((data: ArrayBuffer) => URL.createObjectURL(new Blob([data], { type: 'image/jpg'}))),
            map((url: string) => this.sanitizer.bypassSecurityTrustUrl(url)),
            tap((url: SafeUrl) => Promise.resolve(() => URL.revokeObjectURL(url as string))),
        );
    }
    getDataFromUrl(url: string): Observable<ArrayBuffer> {
        return this.rest.getRaw(url).pipe(tap(data => this.cache[url] = data));
    }

}
