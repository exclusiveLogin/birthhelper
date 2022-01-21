import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../auth-module/auth.service';
import {combineLatest, Observable} from 'rxjs';
import {User} from '../../models/user.interface';
import {filter, map, pluck, shareReplay, switchMap, tap} from 'rxjs/operators';
import {IImage} from '../../Admin/Dashboard/Editor/components/image/image.component';
import {RestService} from '../../services/rest.service';
import {ImageService} from '../../services/image.service';
import {LkService} from '../../services/lk.service';
import {Permission, PermissionLKType, PermissionMap, PermissionSetting} from '../../models/lk.permission.interface';
import {Contragent} from '../../models/contragent.interface';
import {randomColor} from '../utils/random';
import {uniq} from '../utils/uniq';
import {RoutingService} from '../../services/routing.service';

type MenuMode = 'default' | 'lk' | 'contragents';
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {

    // Modes
    mode$: Observable<MenuMode> = this.routingService.routeData$.pipe(
        pluck('main_menu_mode'),
        map(mode => mode ?? 'default'),
        tap(data => console.log('mode$: ', data)),
        shareReplay(1),
    );

    permissionMode$: Observable<PermissionLKType> = this.routingService.routeData$.pipe(
        pluck('permission_mode'),
        tap(data => console.log('permissionMode$: ', data)),
        shareReplay(1),
    );

    isLKMode$ = this.mode$.pipe(
        map(mode => mode === 'lk'),
    );
    isContragentsMode$ = this.mode$.pipe(
        map(mode => mode === 'contragents'),
    );
    isDefaultMode$ = this.mode$.pipe(
        map(mode => mode === 'default'),
    );

    // Permissions data
    onUserAccess$ = this.authService.onUserAccess$;
    user$: Observable<User> = this.authService.user$.pipe(shareReplay(1));
    userPhotoData$ = this.user$.pipe(
        filter(user => !!user.photo_id),
        map(user => user.photo_id),
        switchMap(userPhotoId => this.restService.getEntity('ent_images', userPhotoId)),
        map(image => this.imageService.getImage$(image as IImage)),
    );
    userPhoto$ = this.userPhotoData$.pipe(map(d => d[0]));
    userPhotoSignal$ = this.userPhotoData$.pipe(map(d => d[1]));
    permissionsRaw$: Observable<Permission[]> = this.user$.pipe(
        switchMap(user => this.lkService.getPermissionsByUser(user)),
        tap(data => console.log('getPermissionsByUser: ', data)),
    );
    permSections$: Observable<string[]> = this.permissionsRaw$.pipe(
        map(permissions => uniq(permissions.map(p => p?.meta?.permission_id?.slug))),
    );
    availableContragents$ = combineLatest([this.permissionsRaw$, this.permissionMode$]).pipe(
        map(([permissions, mode]) =>
            permissions
                .filter(p => p?.meta?.permission_id?.slug === mode)
                .map(p => ({entId: p.contragent_entity_id, entKey: p.contragent_entity_key}))),
        tap(data => console.log('availableContragents$: ', data)),
    );

    constructor(
        public authService: AuthService,
        private restService: RestService,
        private imageService: ImageService,
        private lkService: LkService,
        private routingService: RoutingService,
    ) {
        /*
         todo "удалить"
         */
    }

    getUserName(user: User): string {
        return `${user.first_name || ''} ${user.last_name || ''}`;
    }
    ngOnInit(): void {
    }

    getPoint(perm: string): PermissionSetting {
        return PermissionMap[perm];
    }

    getContragent(key: string, id: number): Observable<Contragent> {
        return  this.restService.getEntity(key, id);
    }

    getRandomColor(): string {
        return randomColor();
    }

    trackByIdentity(index: number, item: { entKey: string, entId: number }) {
        return item.entId;
    }

}


