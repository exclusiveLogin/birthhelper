import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {filter, map, shareReplay, switchMap, take} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IDictItem} from 'app/modules/admin/dict.service';
import {SectionType} from './search.service';
import {SearchFilterConfig, SearchSection} from '../models/filter.interface';
import {FilterResult} from '../modules/search/search/components/filter/filter.component';
import {SessionResponse, UserRole} from '../modules/auth-module/auth.service';
import {UserExit, UserSrc} from '../models/user.interface';
import {InterceptorService} from '../modules/auth-module/interceptor.service';
import {ConfiguratorConfigSrc, Restrictor, SelectionOrderSlot} from 'app/modules/configurator/configurator.model';
import {Entity, SectionedContragentSlots} from 'app/models/entity.interface';
import md5 from 'md5';
import {
    ODRER_ACTIONS,
    OrderRequest,
    OrderResponse, OrderResponseAction,
    orderRestMapper,
    OrderSrc,
} from '../models/order.interface';
import {IContainerData} from '@modules/admin/container.model';

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

export interface RegistrationResponseSrc {
    id: number;
    signup: boolean;
    activated: boolean;
    login: string;
    url: string;
    activation: string;
    error?: string;
    password?: string;
}

@Injectable({providedIn: 'root'})
export class RestService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
        private interceptor: InterceptorService,
    ) {
        console.log('RestService', this);
    }

    cacheStore = {};
    public uploadImage(file: File, _data?: IFileAdditionalData): Observable<IFileSaveResponse> {
        const fileSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'entity',
            resource: 'file',
        };

        const data: FormData = new FormData();
        data.append('meta', JSON.stringify(_data));
        data.append('photo', file);

        return this.uploadData(fileSetting, data);
    }

    public uploadData<T>(path: ISettingsParams, data?: FormData): Observable<T> {
        return this.postData(path, data);
    }

    public getConfiguratorSettings(section: SectionType): Observable<ConfiguratorConfigSrc> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: 'configurator',
            resource: section,
        };

        return this.fetchData(entSetting);
    }

    public getRaw(url: string): Observable<any> {
        return this.http.get(url, {observe: 'response', responseType: 'arraybuffer'}).pipe(map(data => data.body));
    }

    public getEntity<T = Entity>(key: string, id: number): Observable<T> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: key,
            resource: id.toString(),
        };

        return this.fetchData<T>(entSetting).pipe(map(d => d?.[0]));
    }

    public activateUser(url: string): Observable<any> {
        const config: ISettingsParams = {
            mode: 'auth',
            segment: 'activation',
            resource: url,
        };

        return this.fetchData(config);
    }

    public getFilterConfigByHash(key: SectionType, hash: string): Observable<SearchFilterConfig> {
        const entSetting: ISettingsParams = {
            mode: 'search',
            segment: key,
            resource: 'filters',
            script: hash,
        };

        return this.fetchData<SearchFilterConfig>(entSetting, null, true);
    }

    public getFilterConfig(key: SectionType): Observable<SearchSection[]> {
        const entSetting: ISettingsParams = {
            mode: 'search',
            segment: key,
        };

        return this.fetchData<SearchSectionSrc>(entSetting)
            .pipe(map(data => data.results));
    }

    public getHashBySearchSection(key: SectionType, filters: FilterResult): Observable<string> {
        const setting: ISettingsParams = {
            mode: 'search',
            segment: key,
        };

        return this.postData<SearchVectorSrc>(setting, filters).pipe(map(result => result.hash));
    }

    public getSlotsByContragent<T = any>(key: string, contragentID: number, restrictors: Restrictor[]): Observable<T[]> {
        const filters: IRestParams = {
            contragent_id: contragentID.toString(),
            active: '1',
        };
        restrictors.forEach(r => filters[r.key] = r.value.toString());
        return this.getEntityList(key, null, filters);
    }

    public getSlotListByContragent(id: number): Observable<SectionedContragentSlots> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: 'slots',
            resource: 'contragent',
            script: id.toString(),
        };

        return this.fetchData<SectionedContragentSlots>(entSetting);
    }

    public getEntityList<T = Entity>(key: string, page?: number, qp?: IRestParams): Observable<T[]> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: key,
        };

        const data: IRestParams = page ? {skip: (20 * (page - 1)).toString()} : {};

        if (qp) {
            Object.assign(data, qp);
        }

        return this.fetchData<T[]>(entSetting, data);
    }

    public getEntitySet(key: string, qp?: IRestParams): Observable<any[]> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: key,
            script: 'set'
        };

        return this.fetchData<any[]>(entSetting, qp);
    }

    public createGuestToken(): Observable<string> {
        return this.authRequest().pipe(
            map(data => data?.token),
        );
    }

    public createNewUser(login?: string, password?: string): Observable<RegistrationResponseSrc> {
        const config: ISettingsParams = {
            mode: 'auth',
            segment: null,
        };

        const data = {login, password};

        return this.putData(config, data, true);
    }

    public authorization(login?: string, password?: string): Observable<string> {
        return this.authRequest(login, password).pipe(map(data => data?.token));
    }

    public authRequest(login?: string, password?: string): Observable<SessionResponse> {
        let data;
        let insecure = false;
        if (login && password) {
            data = {login, password};
        } else {
            insecure = true;
        }

        const ep_config: ISettingsParams = {
            mode: 'auth',
            segment: null,
        };

        return this.postData<SessionResponse>(ep_config, data, insecure);
    }

    public getOrdersByCurrentSession(): Observable<OrderSrc[]> {
        const entSetting: ISettingsParams = {
            mode: 'order',
            segment: null,
        };

        return this.fetchData<OrderResponse>(entSetting, null, true).pipe(
            map(response => response?.result ?? []));
    }

    requestOrdersPost<T = OrderResponseAction>(payload: OrderRequest): Observable<T> {
        const ep_config: ISettingsParams = {
            mode: 'order',
            segment: null,
        };
        return this.postData<T>(ep_config, payload);
    }

    public createOrder(selection): Observable<any> {
        const data = orderRestMapper(selection, ODRER_ACTIONS.ADD);
        return this.requestOrdersPost(data);
    }

    public changeOrderBySelection(
        action: ODRER_ACTIONS,
        selection?: SelectionOrderSlot,
    ): Observable<OrderSrc> {
        const data = orderRestMapper(selection, action);
        return this.requestOrdersPost(data);
    }

    public getUserRole(): Observable<UserRoleSrc> {
        const ep_config: ISettingsParams = {
            mode: 'auth',
            segment: 'role',
        };

        return this.fetchData(ep_config);
    }

    public getUser(): Observable<UserSrc> {
        const ep_config: ISettingsParams = {
            mode: 'auth',
            segment: 'user',
        };

        return this.fetchData(ep_config);
    }

    public getContainerFromId(key: string, id: number, qp?: IRestParams): Observable<IContainerData> {
        const entSetting: ISettingsParams = {
            mode: 'api',
            segment: 'containers',
            resource: `${key}`,
            script: '' + id,
        };

        return this.fetchData<IContainerData>(entSetting, qp);
    }

    public logout(everywhere?: boolean): Observable<UserExit> {
        const ep_config: ISettingsParams = {
            mode: 'auth',
            segment: null,
        };

        if (everywhere) {
            ep_config.segment = 'all';
        }

        return this.remData(ep_config);
    }

    public fetchDictionary(name: string, filters?: Record<string, string>, page?: number): Observable<IDictItem[]> {
        const dictSetting: ISettingsParams = {
            mode: 'api',
            segment: 'dict',
            resource: name
        };

        let data: IRestParams = page ? {skip: (20 * (page - 1)).toString()} : {};
        if (filters) { data = {...data, ...filters}; }

        return this.fetchData<IDictItem[]>(dictSetting, data);
    }

    pathGen(path: ISettingsParams): void {
        Object.keys(path).filter(key => path[key]).forEach(key => path[key] = '/' + path[key]);
    }

    createUrl(path: ISettingsParams): string {
        return `${this.api.getApiPath()}${path.mode ?? ''}${path.segment ?? ''}${path.resource ?? ''}${path.script ?? ''}`;
    }

    public fetchData<T>(path: ISettingsParams, data?: IRestParams, nocache = false): Observable<T> {
        console.log('fetchData', path);
        if (path?.mode === 'auth') {
            nocache = true;
        }
        if (path) {
            this.pathGen(path);
        }
        const cacheKey = md5(`${JSON.stringify(path)}_${JSON.stringify(data)}`);

        if (this.cacheStore[cacheKey] && !nocache) {
            return this.cacheStore[cacheKey] as Observable<T>;
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.get(
            url, {params: data, headers: token ? new HttpHeaders({token}) : null})
            .pipe(
                this.interceptor.interceptor(),
                filter(d => !!d),
                take(1),
            );
        const req = this.interceptor.token$.pipe(
            take(1),
            switchMap(http),
            shareReplay(1),
        );
        if (!nocache) {
            this.cacheStore[cacheKey] = req;
        }
        return req as Observable<T>;
    }

    public postData<T>(path: ISettingsParams, data?: any, insecure?: boolean): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token?: string) => this.http.post(url, data,
            {headers: token ? new HttpHeaders({token}) : null}
        ).pipe(
            this.interceptor.interceptor(),
            filter(d => !!d),
            take(1),
        );

        const req = insecure ? http() : this.interceptor.token$.pipe(
            take(1),
            switchMap(http),
        );

        return req as Observable<T>;
    }

    public putData<T>(path: ISettingsParams, data?: any, insecure?: boolean): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token?: string) => this.http.put(url, data,
            {headers: token ? new HttpHeaders({token}) : null}
        ).pipe(
            this.interceptor.interceptor(),
            filter(d => !!d),
            take(1),
        );

        const req = insecure ? http() : this.interceptor.token$.pipe(
            take(1),
            switchMap(http),
        );

        return req as Observable<T>;
    }

    public postDataContainer<T>(path: ISettingsParams, data?: IRestBody): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.post(url, data.body,
            {headers: token ? new HttpHeaders({token}) : null}
        ).pipe(
            this.interceptor.interceptor(),
            filter(d => !!d),
            take(1),
        );

        const req = this.interceptor.token$.pipe(
            take(1),
            switchMap(http),
        );

        return req as Observable<T>;
    }

    public remData<T>(path: ISettingsParams, data?: IRestParams): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.request('delete', url,
            {body: data, headers: token ? new HttpHeaders({token}) : null}
        ).pipe(
            this.interceptor.interceptor(),
            filter(d => !!d),
            take(1),
        );

        const req = this.interceptor.token$.pipe(
            take(1),
            switchMap(http),
        );

        return req as Observable<T>;
    }
}
