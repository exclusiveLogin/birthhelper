import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISettingsParams, RestService } from './rest.service';

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
    console.log('DEVSS DICT');
  }

  public getDict( name: string, page: number = 1 ): Observable<IDictItem[]> {
    return this.rest.getDict( name, page );
  }
}
