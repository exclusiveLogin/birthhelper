import { Injectable } from '@angular/core';
import { DictService, IDictItem } from '../dict.service';
import { EntityService, IEntity, ISet } from '../entity.service';
import { Observable } from 'rxjs/Observable';
import { ITableFilters } from './table/table.component';
import { IRestParams } from '../rest.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ProviderService {

  constructor( private dict: DictService, private entity: EntityService ) { }


  public getItemsFirstPortion( key: string, type: string ): Observable<IEntity[] | IDictItem[]>{
    return type === 'dict' ? this.getDictPage( key ) : this.getEntPage( key );
  }

  public getItemPage( key: string, type: string, page: number = 1, queryParams: IRestParams): Observable<IEntity[] | IDictItem[]>{
    return type === 'dict' ? this.getDictPage( key, page ) : this.getEntPage( key, page, queryParams );
  }

  public getFilters( key: string, type: string ): Observable<ITableFilters[]>{
    return type === 'dict' ? this.getDictFilters( key ) : this.getEntityFilters( key );
  }

  public getItemsSet( key: string, type: string ){
    return ( type ) ? this.getEntSet( key ) : of(null);
  }

  public getDictPage( key: string, page: number = 1){
    return this.dict.getDict( key, page );
  }

  public getFullDict( key: string ) {
    return this.dict.getDict( key );
  }

  private getEntPage( key: string, page: number = 1, qp?: IRestParams){
    return this.entity.getEnt( key, page, qp );
  }

  private getEntSet( key: string ): Observable<ISet>{
    return this.entity.getEntSet( key );
  }

  private getDictFilters( key: string ): Observable<ITableFilters[]>{
    return Observable.of(null);
  }

  private getEntityFilters( key: string ): Observable<ITableFilters[]>{
    return this.entity.getEntFilters( key );
  }

}
