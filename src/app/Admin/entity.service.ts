import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISettingsParams, RestService } from './rest.service';

export interface IEntityItem {
  id: number;
  name: string;
  title: string;
  icon?: string;
  comment?: string;
}

export interface IEntity {
  key: string;
  entities: IEntityItem[];
}

export interface ISet{
  total: string;
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

  public getEnt( name: string, page: number = 1 ): Observable<IEntityItem[]> {
    return this.rest.getEntities( name, page );
  }

  public getEntSet( key: string ): Observable<ISet>{
    return this.rest.getEntitySet( key );
  }
}
