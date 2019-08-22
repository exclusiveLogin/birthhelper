import { Injectable } from '@angular/core';
import { ISettingsParams, RestService, IRestParams, IRestBody } from './rest.service';
import { Observable } from 'rxjs';
import { IEntityItem, IEntity } from './entity.service';

export interface IContainer{
    container_id_key: string;
    db_entity: string;
    db_links: string;
    db_list: string;
    entity_fields: string[];
    entity_key: string;
    name: string;
    overrided_fields: string[];
    title: string;
}

export interface IContainerData{
    id: number;
    items: {
        entity: IEntityItem,
    }[]
}

@Injectable()
export class ContainerService {

constructor(
    private rest: RestService,
) { }

public getContainers( name: string, page: number = 1, qp?: IRestParams ): Observable<IContainerData[]> {
    return this.rest.getContainersList( name, page, qp );
  }

public getContainer( name: string, container_id: number, qp?: IRestParams ): Observable<IContainerData[]> {
    return this.rest.getContainerFromId( name, container_id, qp );
  }

public saveContainer( name: string, container_id: number, qp?: IRestBody): Observable<any>{
    return this.rest.saveContainer(name, container_id, qp);
}

}
