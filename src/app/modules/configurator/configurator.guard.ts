import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {RestService} from '../../services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorGuard implements CanActivate {

    constructor(private ar: ActivatedRoute, private rest: RestService) {}

    canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const id = route.paramMap.get('id');
      const sectionKey = route.data?.section;

      console.log('ConfiguratorGuard', route, id, sectionKey);

      return true;


  }

}
