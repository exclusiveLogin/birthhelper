import {Injectable} from '@angular/core';

import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';

import {Observable} from 'rxjs';
import {RestService} from '../../services/rest.service';
import {SectionType} from 'app/services/search.service';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfiguratorGuard implements CanActivate {

    constructor(private rest: RestService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const id = !!route.paramMap.get('id') ?
            !isNaN(Number(route.paramMap.get('id'))) ?
                Number(route.paramMap.get('id')) :
                null :
            null;

        const sectionKey: SectionType = route.data?.entity_key;
        console.log('ConfiguratorGuard', route, id, sectionKey);

        if (sectionKey && id) {
            return this.rest.getEntity(sectionKey, id).pipe(map(ent => !!ent));
        }
        return false;
    }

    isSectionKeyValid(key: string): key is SectionType {
        return key === 'clinic';
    }

}
