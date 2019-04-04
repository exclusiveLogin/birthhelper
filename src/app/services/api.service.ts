import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ApiService {
  private MAINAPI = 'http://91.240.87.153/backend/';

  constructor() { }

  public getApi(): string {
    return this.MAINAPI;
  }

  public getIconPath( type: string ){
    return this[type.toUpperCase()+'_ICONS'];
  }

  public getImagePath( type: string ){
    return this[type.toUpperCase()+'_IMAGE'];
  }

  public getIconPathRx( type: string ): Observable<string> {
    return Observable.of( this[type.toUpperCase()+'_ICONS'] );
  }

  public getImagePathRx( type: string ): Observable<string> {
    return Observable.of( this[type.toUpperCase()+'_IMAGE'] );
  }

  public getApiRx(): Observable<string> {
    return Observable.of(this.MAINAPI);
  }

}
