import {Injectable} from '@angular/core';
import {RestService, IRestParams, IRestBody} from './rest.service';
import {Observable} from 'rxjs';
import {IContainerData} from './container.model';


@Injectable({providedIn: 'root'})
export class ContainerService {

  constructor(
    private rest: RestService,
  ) {
  }

  public getContainers(name: string, page: number = 1, qp?: IRestParams): Observable<IContainerData[]> {
    return this.rest.getContainersList(name, page, qp);
  }

  public getContainer(name: string, container_id: number, qp?: IRestParams): Observable<IContainerData> {
    return this.rest.getContainerFromId(name, container_id, qp);
  }

  public saveContainer(name: string, container_id: number, qp?: IRestBody): Observable<any> {
    return this.rest.saveContainer(name, container_id, qp);
  }

  public removeContainer(name, container_id): Observable<any> {
    return this.rest.removeContainer(name, container_id);
  }

}
