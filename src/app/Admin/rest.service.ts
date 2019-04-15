import { Injectable } from '@angular/core';
import { IDictItem } from './dict.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

export interface ISettingsParams {
  mode: string;
  segment: string;
  script?: string;
  resource?: string;
};

export interface IRestParams {
  [name: string]: string; 
}

export interface IRestBody {
  body: any;
}

@Injectable()
export class RestService {

  constructor(
    private http: HttpClient,

  ) { 
    console.log('ADMIN REST SERVICE', this);
  }

  public getFormFieldCurrentValue( name: string ): any {
    return null;
  }

  public getDict( name: string): Observable<IDictItem[]> {
    const dictSetting: ISettingsParams = {
      mode: 'admin',
      segment: 'dict',
      resource: name
    };
    return this.getData<IDictItem[]>( dictSetting );
  }

  public getData<T>( path: ISettingsParams, data?: IRestParams): Observable<T>{

    if( path ) Object.keys( path ).forEach(key => path[key] = '/' + path[key]);

    let url = `${path.mode ? path.mode : ''}${path.segment ? path.segment : ''}${path.resource ? path.resource : ''}${path.script ? path.script : ''}`;
   
    let req = this.http.get( url, { params: data } );

    return req as Observable<T>;
  }

}
