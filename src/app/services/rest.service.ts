import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IDictItem} from 'app/Admin/dict.service';
import {EntityType} from './data-provider.service';
import {SearchSection} from '../models/filter.interface';
import {FilterResult} from '../search/search/components/filter/filter.component';
import {SessionResponse, UserRole} from '../modules/auth-module/auth.service';
import {User} from '../models/user.interface';
import {Interceptor403Service} from '../modules/auth-module/interceptor403.service';

export interface ISettingsParams {
    mode: string;
    segment: string;
    script?: string;
    resource?: string;
}

export interface IRestParams {
    [name: string]: string;
}

export interface IRestBody {
    body: any;
}

export interface IFileSaveResponse {
    status: string;
    file: {
        id: number
    };
}

export interface IFile {
    id: number;
    filename: string;
    folder: string;
    type: string;
}

export interface IFileAdditionalData {
    title?: string;
    description?: string;
    position?: any;
}

interface SearchSectionSrc {
    index: string;
    results: SearchSection[];
}

export interface SearchVectorSrc {
    hash: string;
    input: FilterResult;
    result: FilterResult;
}

export interface UserRoleSrc {
    id: number;
    slug: UserRole;
    title: string;
    description: string;
    rank: number;
    datetime_create: string;
    datetime_update: string;
}

@Injectable({providedIn: 'root'})
export class RestService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
        private interceptor: Interceptor403Service,
    ) {
    }

    public getEntity(key: string, id: number): Observable<any> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: 'entity',
            resource: key,
            script: id.toString()
        };

        return this.getData(entSetting);
    }

    public getFilterConfig(key: EntityType): Observable<SearchSection[]> {
        console.log('getFilterConfig');
        const entSetting: ISettingsParams = {
            mode: 'search',
            segment: key,
        };

        return this.getData<SearchSectionSrc>(entSetting)
            .pipe(map(data => data.results));
    }

    public getHashBySearchSection(key: EntityType, filters: FilterResult): Observable<string> {
        console.log('getHashBySearchSection', key, filters);
        const setting: ISettingsParams = {
            mode: 'search',
            segment: key,
        };

        return this.postData<SearchVectorSrc>(setting, filters).pipe(map(result => result.hash));
    }

    public getEntityList(key: string, page?: number, qp?: IRestParams): Observable<any[]> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: key,
        };

        const data: IRestParams = page ? {skip: (20 * (page - 1)).toString()} : {};

        if (qp) {
            Object.assign(data, qp);
        }

        return this.getData<any[]>(entSetting, data);
    }

    public getEntitySet(key: string, qp?: IRestParams): Observable<any[]> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: key,
            script: 'set'
        };

        return this.getData<any[]>(entSetting, qp);
    }

    public createGuestToken(): Observable<string> {
        return this.createSession().pipe(map(data => data?.token));
    }

    public createUserToken(login?: string, password?: string): Observable<string> {
        console.log('createUserToken', login, password);
        return this.createSession(login, password).pipe(map(data => data?.token));
    }

    public createSession(login?: string, password?: string): Observable<SessionResponse> {
        let data;
        if (login || password) {
            data = {};
            data = login ? {...data, login} : {...data};
            data = password ? {...data, password} : {...data};
        }

        const ep_config: ISettingsParams = {
            mode: 'auth',
            segment: null,
        };

        return this.postData<SessionResponse>(ep_config, data, true);
    }

    public getUserRole(): Observable<UserRoleSrc> {
        const ep_config: ISettingsParams = {
            mode: 'auth',
            segment: 'role',
        };

        return this.getData(ep_config);
    }

    public getUser(): Observable<User> {
        const ep_config: ISettingsParams = {
            mode: 'auth',
            segment: 'user',
        };

        return this.getData(ep_config);
    }

    public getDict(name: string, page?: number): Observable<IDictItem[]> {
        const dictSetting: ISettingsParams = {
            mode: 'api',
            segment: 'dict',
            resource: name
        };

        const data: IRestParams = page ? {skip: (20 * (page - 1)).toString()} : null;

        return this.getData<IDictItem[]>(dictSetting, data);
    }

    pathGen(path: ISettingsParams): void {
        Object.keys(path).filter(key => path[key]).forEach(key => path[key] = '/' + path[key]);
    }

    createUrl(path: ISettingsParams): string {
        return `${this.api.getApiPath()}${path.mode ?? ''}${path.segment ?? ''}${path.resource ?? ''}${path.script ?? ''}`;
    }

    public getData<T>(path: ISettingsParams, data?: IRestParams): Observable<T> {

        console.log('getData fire REST: ', path, data);

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.get(
            url, {params: data, headers: token ?  new HttpHeaders({token}) : null, observe: 'response'})
            .pipe(
                this.interceptor.interceptor403(),
                filter(d => !!d),
            );
        this.interceptor.token$.subscribe((r) => console.log('test', r));

        const req = this.interceptor.token$.pipe(
            tap((token) => console.log('getData token REST: ', token)),
            switchMap(http));

        return req as Observable<T>;
    }

    public postData<T>(path: ISettingsParams, data?: any, insecure?: boolean): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token?: string) => this.http.post(url, data,
            {headers: token ? new HttpHeaders({token}) : null, observe: 'response'}
        ).pipe(
            this.interceptor.interceptor403(),
            filter(d => !!d),
        );

        const req = insecure ? http() : this.interceptor.token$.pipe(
            tap((token) => console.log('postData token REST: ', token)),
            switchMap(http));

        return req as Observable<T>;
    }

    public postDataContainer<T>(path: ISettingsParams, data?: IRestBody): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.post(url, data.body,
            {headers: token ? new HttpHeaders({token}) : null, observe: 'response'}
        ).pipe(
            this.interceptor.interceptor403(),
            filter(d => !!d),
        );

        const req = this.interceptor.token$.pipe(
            tap((token) => console.log('postData token REST: ', token)),
            switchMap(http));

        return req as Observable<T>;
    }

    public remData<T>(path: ISettingsParams, data?: IRestParams): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.request('delete', url,
            {body: data, headers: token ? new HttpHeaders({token}) : null, observe: 'response'}
        ).pipe(
                this.interceptor.interceptor403(),
                filter(d => !!d),
            );

        const req = this.interceptor.token$.pipe(
            tap((token) => console.log('remData token REST: ', token)),
            switchMap(http));

        return req as Observable<T>;
    }
}
