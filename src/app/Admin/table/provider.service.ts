import { Injectable } from '@angular/core';
import { DictService, IDictItem } from '../dict.service';
import { EntityService, IEntity, ISet } from '../entity.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProviderService {

  constructor( private dict: DictService, private entity: EntityService ) { }


  public getItemsFirstPortion( key: string, type: string ): Observable<IEntity[] | IDictItem[]>{
    return type === 'dict' ? this.getDictPage( key ) : this.getEntPage( 'ent_' + key );
  }

  public getItemPage( key: string, type: string, page: number = 1): Observable<IEntity[] | IDictItem[]>{
    return type === 'dict' ? this.getDictPage( key, page ) : this.getEntPage( 'ent_' + key, page );
  }

  public getItemsSet( key: string, type: string ){
    return ( type === 'entity' ) ? this.getEntSet( 'ent_' + key ) : Observable.of(null);
  }

  public getDictPage( key: string, page: number = 1){
    return this.dict.getDict( key, page );
  }

  public getEntPage( key: string, page: number = 1){
    return this.entity.getEnt( key, page );
  }

  public getEntSet( key: string ): Observable<ISet>{
    return this.entity.getEntSet( key );
  }

}
