import {Injectable} from '@angular/core';
import {IDictItem} from './dict.service';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {IEntityItem, ISet} from './entity.model';
import {ITableFilter} from './table/table/table.component';
import {IContainerData} from './container.model';
import {LoaderService} from './loader.service';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InterceptorService} from '../auth-module/interceptor.service';

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
    aws: string;
    folder: string;
    type: string;
}

export interface IFileAdditionalData {
    title?: string;
    description?: string;
    position?: any;
    folder?: string;
}

@Injectable({providedIn: 'root'})
export class RestService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
        private loader: LoaderService,
        private interceptor: InterceptorService,
    ) {}

    public createEntity(key: string, data: IEntityItem): Observable<any> {
        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'entity',
            resource: key
        };

        return this.postData(entSetting, data);
    }

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

    public getEntity(key: string, id: number): Observable<any> {
        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'entity',
            resource: key,
            script: id.toString()
        };

        return this.getData(entSetting);
    }

    public deleteEntity(key: string, id: number): Observable<string> {
        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'entity',
            resource: key
        };

        return this.remData<string>(entSetting, {id: id.toString()});

    }

    public removeSlotEntity(key: string, id: number): Observable<string> {
        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'slots',
            resource: key,
            script: id.toString()
        };

        return this.remData<string>(entSetting);

    }

    public getEntityFilters(key: string): Observable<ITableFilter[]> {
        const entFiltersSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'entity',
            resource: key,
            script: 'filters'
        };

        return this.getData<ITableFilter[]>(entFiltersSetting);
    }

    public getEntitySet(key: string, qp?: IRestParams): Observable<ISet> {
        const entSetSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'entity',
            resource: key,
            script: 'set'
        };

        return this.getData<ISet>(entSetSetting, qp);
    }

    public getEntities(key: string, page?: number, qp?: IRestParams): Observable<IEntityItem[]> {
        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'entity',
            resource: key
        };

        const data: IRestParams = page ? {skip: (20 * (page - 1)).toString()} : null;

        if (qp) {
            Object.assign(data, qp);
        }

        return this.getData<IEntityItem[]>(entSetting, data);
    }

    public getContainersList(key: string, page?: number, qp?: IRestParams): Observable<IContainerData[]> {

        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'container',
            resource: key
        };

        const data: IRestParams = page ? {skip: (20 * (page - 1)).toString()} : null;

        if (qp) {
            Object.assign(data, qp);
        }

        return this.getData<IContainerData[]>(entSetting, data);
    }

    public getContainerFromId(key: string, id: number, qp?: IRestParams): Observable<IContainerData> {

        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: `containers/${key}`,
            resource: '' + id
        };

        return this.getData<IContainerData>(entSetting, qp);
    }

    public saveContainer(key: string, id: number, qp?: IRestBody): Observable<any> {

        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: `containers/${key}`,
            resource: '' + id
        };

        return this.postDataContainer(entSetting, qp);
    }

    public removeContainer(key: string, id: number): Observable<any> {

        const entSetting: ISettingsParams = {
            mode: 'admin',
            segment: `containers/${key}`,
            resource: '' + id
        };
        const data = {};

        return this.remData(entSetting, data);
    }

    public getDict(name: string, page?: number): Observable<IDictItem[]> {
        const dictSetting: ISettingsParams = {
            mode: 'admin',
            segment: 'dict',
            resource: name
        };

        const data: IRestParams = page ? {skip: (20 * (page - 1)).toString()} : null;

        return this.getData<IDictItem[]>(dictSetting, data);
    }

    pathGen(path: ISettingsParams): void {
        Object.keys(path).forEach(key => path[key] = '/' + path[key]);
    }

    createUrl(path: ISettingsParams): string {
        return `${this.api.getApiPath()}${path.mode ?? ''}${path.segment ?? ''}${path.resource ?? ''}${path.script ?? ''}`;
    }

    createTokenizeRequest(httpRequest$: (token: string) => Observable<any>): Observable<any> {
        return this.interceptor.token$.pipe(
            take(1),
            switchMap(httpRequest$),
            tap(
                () => this.loader.hide(),
                (err) => this.loader.setError(err.message ? err.message : 'Ошибка: ' + err)
            )
        );
    }

    public getData<T>(path: ISettingsParams, data?: IRestParams): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.get(
            url, {params: data, headers: token ? new HttpHeaders({token}) : null})
            .pipe(
                this.interceptor.interceptor(),
            );

        const req = this.createTokenizeRequest(http);

        this.loader.show();

        return req as Observable<T>;
    }

    public uploadData<T>(path: ISettingsParams, data?: FormData): Observable<T> {
        return this.postData(path, data);
    }

    public postData<T>(path: ISettingsParams, data?: IEntityItem | any): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.post(
            url, data, {headers: token ? new HttpHeaders({token}) : null, observe: 'response'})
            .pipe(
                this.interceptor.interceptor(),
            );

        const req = this.createTokenizeRequest(http).pipe(map(_ => _.body));

        this.loader.show();

        return req as Observable<T>;
    }

    public postDataContainer<T>(path: ISettingsParams, data?: IRestBody): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.post(
            url, data.body, {headers: token ? new HttpHeaders({token}) : null, observe: 'response'})
            .pipe(
                this.interceptor.interceptor(),
            );

        const req = this.createTokenizeRequest(http);

        this.loader.show();

        return req as Observable<T>;
    }

    public remData<T>(path: ISettingsParams, data?: IRestParams): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = this.createUrl(path);

        const http = (token) => this.http.request('delete',
            url, {body: data, headers: token ? new HttpHeaders({token}) : null, observe: 'response'})
            .pipe(
                this.interceptor.interceptor(),
            );

        const req = this.createTokenizeRequest(http);

        this.loader.show();

        return req as Observable<T>;
    }
}
