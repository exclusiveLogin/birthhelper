import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService, IRestParams, IFileAdditionalData} from './rest.service';
import { ITableFilter } from './table/table/table.component';
import {IImage} from './Dashboard/Editor/components/image/image.component';
import {map} from 'rxjs/operators';
import {IEntityItem, ISet} from './entity.model';

@Injectable({providedIn: 'root'})
export class EntityService {

  constructor(
    private rest: RestService,
  ) {
    console.log('DEVSS ENT', this);
  }

  public getEnt( name: string, page: number = 1, qp?: IRestParams ): Observable<IEntityItem[]> {
    return this.rest.getEntities( name, page, qp );
  }

  public getEntity( name: string, id: number ): Observable<IEntityItem[]> {
    return this.rest.getEntity( name, id);
  }

  public getEntSet( key: string, qp?: IRestParams ): Observable<ISet> {
    return this.rest.getEntitySet( key , qp);
  }

  public getFile(id: number, type= 'ent_images', multi?: boolean): Observable<any> {
    return this.getEntity(type, id)
      .pipe( map(ImageSet => !multi ? ImageSet.length ? ImageSet[0] : null : ImageSet )) as any as Observable<IImage>;
  }

  public uploadImg( file, data?: IFileAdditionalData ) {
    return this.rest.uploadImage( file, data );
  }

  public getEntFilters( key: string ): Observable<ITableFilter[]> {
    return this.rest.getEntityFilters( key );
  }

  public remEnt(name: string, id: number): Observable<string> {
    return this.rest.deleteEntity(name, id);
  }

  public removeSlotEntity(name: string, id: number): Observable<string> {
    return this.rest.removeSlotEntity(name, id);
  }

  public createEnt(name: string, data: IEntityItem): Observable<any> {
    return this.rest.createEntity(name, data);
  }
}
