import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ApiService} from './api.service';
import {filter} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {IDictItem} from 'app/Admin/dict.service';

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

@Injectable({providedIn: 'root'})
export class RestService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
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
        Object.keys(path).forEach(key => path[key] = '/' + path[key]);
    }

    public getData<T>(path: ISettingsParams, data?: IRestParams): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = `${this.api.getApiPath()}${path.mode ? path.mode : ''}${path.segment ? path.segment : ''}${path.resource ? path.resource : ''}${path.script ? path.script : ''}`;

        const req = this.http.get(
            url, {params: data})
            .pipe(
                filter(d => !!d),
            );
        return req as Observable<T>;
    }

    public uploadData<T>(path: ISettingsParams, data?: FormData): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = `${this.api.getApiPath()}${path.mode ? path.mode : ''}${path.segment ? path.segment : ''}${path.resource ? path.resource : ''}${path.script ? path.script : ''}`;

        const req = this.http.post(url, data)
            .pipe(
                filter(d => !!d),
            );
        return req as Observable<T>;
    }

    public postData<T>(path: ISettingsParams, data?: any): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = `${this.api.getApiPath()}${path.mode ? path.mode : ''}${path.segment ? path.segment : ''}${path.resource ? path.resource : ''}${path.script ? path.script : ''}`;

        const req = this.http.post(url, data).pipe(
            filter(d => !!d),
        );
        return req as Observable<T>;
    }

    public postDataContainer<T>(path: ISettingsParams, data?: IRestBody): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = `${this.api.getApiPath()}${path.mode ? path.mode : ''}${path.segment ? path.segment : ''}${path.resource ? path.resource : ''}${path.script ? path.script : ''}`;

        const req = this.http.post(url, data.body).pipe(
            filter(d => !!d),
        );
        return req as Observable<T>;
    }

    public remData<T>(path: ISettingsParams, data?: IRestParams): Observable<T> {

        if (path) {
            this.pathGen(path);
        }

        const url = `${this.api.getApiPath()}${path.mode ? path.mode : ''}${path.segment ? path.segment : ''}${path.resource ? path.resource : ''}${path.script ? path.script : ''}`;

        const req = this.http.request('delete', url, {body: data}).pipe(
            filter(d => !!d),
        );
        return req as Observable<T>;
    }

}
