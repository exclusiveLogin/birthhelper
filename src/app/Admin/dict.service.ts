import { Injectable } from '@angular/core';

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

@Injectable()
export class DictService {

  constructor() {
    console.log('DEVSS DICT');
  }

  private DictRepo: Set<IDict> = new Set();

  public setDict( name: string, dict: IDictItem[] ): void {
    this.DictRepo.add({ dctKey: name, dict });
  }

  public getDict( name: string ): IDictItem[] {
    const dictionaries: IDict[] = [ ...this.DictRepo ];
    return dictionaries.find( dct => dct.dctKey === name ).dict;
  }
}
