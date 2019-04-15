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

  private DictRepo: Set<IDict> = new Set();

  public setDict( name: string, dict: IDictItem[] ): void {
    this.DictRepo.add({ dctKey: name, dict });
  }

  public getDict( name: string ): Observable<IDictItem[]> {
    const dictionaries: IDict[] = [ ...this.DictRepo ];
    const targetDict = dictionaries.find( dct => dct.dctKey === name );

    // если нет словаря то делаем попытку загрузить его с бека по ключу
    if( !!targetDict ) return Observable.of(targetDict.dict);
    
    return this.rest.getDict( name );
  }
}
