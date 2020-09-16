import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISettingsParams, RestService } from './rest.service';
import {share, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

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
}

@Injectable()
export class DictService {

  constructor(
    private rest: RestService,
  ) {
    console.log('DEVSS DICT', this);
  }

  private dictRepo: { [key: string]: IDictItem[] } = {};
  private dictGetStreams$: { [key: string]: Observable<IDictItem[]> } = {};

  public getDict( name: string, page: number = 1 ): Observable<IDictItem[]> {
    if( name && this.dictRepo[name] ) return of(this.dictRepo[name]);
    if( this.dictGetStreams$[name] ) return this.dictGetStreams$[name];

    this.dictGetStreams$[name] = this.rest.getDict( name, page )
      .pipe(
        tap(dict => {
          if( dict ) this.dictRepo[name] = dict;
        }),
        share()
      );

    return this.dictGetStreams$[name];
  }

  public resetDict(key?: string): void {
    if (key && this.dictRepo[key]) {
      delete this.dictRepo[key];
      return;
    }

    this.dictRepo = {};
  }
}
