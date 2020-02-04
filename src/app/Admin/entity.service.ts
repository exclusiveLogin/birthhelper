import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {ISettingsParams, RestService, IRestParams, IFileAdditionalData} from './rest.service';
import { ITableFilters } from './table/table/table.component';
import { IFieldSetting, ILinkFieldSetting } from './form.service';
import {IContainer} from './container.service';
import {IImage} from './Dashboard/Editor/components/image/image.component';
import {map} from 'rxjs/operators';

export interface IEntityItem {
  id: number;
  name?: string;
  title?: string;
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
  container?: IContainer;
  slot: string;
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

  public getEntity( name: string, id: number ): Observable<IEntityItem[]> {
    return this.rest.getEntity( 'ent_'+name, id);
  }

  public getEntSet( key: string ): Observable<ISet>{
    return this.rest.getEntitySet( 'ent_'+key );
  }

  public getFile(id: number, type='images', multi?:boolean): Observable<any>{
    return this.getEntity(type, id)
      .pipe( map(ImageSet => !multi? ImageSet.length ? ImageSet[0] : null : ImageSet )) as any as Observable<IImage>;
  }

  public uploadImg( file, data?: IFileAdditionalData ){
    return this.rest.uploadImage( file, data );
  }

  public getEntFilters( key: string ): Observable<ITableFilters[]>{
    return this.rest.getEntityFilters( 'ent_'+key );
  }

  public remEnt(name: string, id: number): Observable<string>{
    return this.rest.deleteEntity('ent_'+name, id);
  }

  public removeSlotEntity(name: string, id: number): Observable<string>{
    return this.rest.removeSlotEntity(name, id);
  }

  public createEnt(name: string, data: IEntityItem): Observable<any>{
    return this.rest.createEntity('ent_' + name, data);
  }
}
