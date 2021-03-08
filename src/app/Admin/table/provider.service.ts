import { Injectable } from '@angular/core';
import { DictService, IDictItem } from '../dict.service';
import {EntityService, IEntityItem, ISet} from '../entity.service';
import { Observable ,  of } from 'rxjs';
import { ITableFilter } from './table/table.component';
import { IRestParams } from '../rest.service';

@Injectable()
export class ProviderService {

  constructor( private dict: DictService, private entity: EntityService ) { }


  public getItemsFirstPortion( key: string, type: string ): Observable<IEntityItem[] | IDictItem[]> {
    return type === 'dict' ? this.getDictPage( key ) : this.getEntPage( key );
  }

  public getItemPage( key: string, type: string, page: number = 1, queryParams: IRestParams = {}): Observable<IEntityItem[] | IDictItem[]> {
    return type === 'dict' ? this.getDictPage( key, page ) : this.getEntPage( key, page, queryParams );
  }

  public getFilters( key: string, type: string ): Observable<ITableFilter[]> {
    return type === 'dict' ? this.getDictFilters( key ) : this.getEntityFilters( key );
  }

  public getItemsSet( key: string, type: string ) {
    return ( type ) ? this.getEntSet( key ) : of(null);
  }

  public getDictPage( key: string, page: number = 1) {
    return this.dict.getDict( key, page );
  }

  public getFullDict( key: string ) {
    return this.dict.getDict( key );
  }

  private getEntPage( key: string, page: number = 1, qp?: IRestParams) {
    return this.entity.getEnt( key, page, qp );
  }

  private getEntSet( key: string ): Observable<ISet> {
    return this.entity.getEntSet( key );
  }

  private getDictFilters( key: string ): Observable<ITableFilter[]> {
    return of(null);
  }

  private getEntityFilters( key: string ): Observable<ITableFilter[]> {
    return this.entity.getEntFilters( key );
  }

}
