import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISettingsParams, RestService, IRestParams } from './rest.service';
import { ITableFilters } from './table/table/table.component';
import { IFieldSetting, ILinkFieldSetting } from './form.service';

export interface IEntityItem {
  id: number;
  name: string;
  title: string;
  icon?: string;
  comment?: string;
  description?: string;
}

export interface IEntity {
  key: string;
  entities: IEntityItem[];
}

export interface ISet{
  total: string;
  fields: IFieldSetting[];
  links: ILinkFieldSetting[];
}

const settingsParams: ISettingsParams = {
  mode: 'admin',
  segment: 'entity'
}

@Injectable()
export class EntityService {

  constructor(
    private rest: RestService,
  ) {
    console.log('DEVSS ENT', this);
  }

  public getEnt( name: string, page: number = 1, qp?: IRestParams ): Observable<IEntityItem[]> {
    return this.rest.getEntities( 'ent_'+name, page, qp );
  }

  public getEntSet( key: string ): Observable<ISet>{
    return this.rest.getEntitySet( 'ent_'+key );
  }

  public getEntFilters( key: string ): Observable<ITableFilters[]>{
    return this.rest.getEntityFilters( 'ent_'+key );
  }

  public remEnt(name: string, id: number): Observable<string>{
    return this.rest.deleteEntity('ent_'+name, id);
  }

  public createEnt(name: string, data: IEntityItem): Observable<any>{
    return this.rest.createEntity('ent_' + name, data);
  }
}
