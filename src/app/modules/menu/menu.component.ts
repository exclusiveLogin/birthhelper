import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../auth-module/auth.service';
import {Observable} from 'rxjs';
import {User} from '../../models/user.interface';
import {filter, map, pluck, shareReplay, switchMap, tap} from 'rxjs/operators';
import {IImage} from '../../Admin/Dashboard/Editor/components/image/image.component';
import {RestService} from '../../services/rest.service';
import {ImageService} from '../../services/image.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {LkService} from '../../services/lk.service';
import {Permission, PermissionMap, PermissionSetting} from '../../models/lk.permission.interface';
import {Contragent} from '../../models/contragent.interface';
import {randomColor} from '../utils/random';
import {uniq} from '../utils/uniq';

type MenuMode = 'default' | 'lk' | 'contragents';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {

    routeData$ = this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.ar.snapshot?.firstChild?.data ?? this.ar.snapshot?.data ?? {}),
        tap(data => console.log('routeData$: ', data)),
        pluck('mode'),
        shareReplay(1),
    );
    mode$: Observable<MenuMode> = this.routeData$.pipe(
        tap(data => console.log('mode$: ', data)),
    );
    isLKMode$ = this.mode$.pipe(
        map(mode => mode === 'lk'),
    );
    isContragentsMode$ = this.mode$.pipe(
        map(mode => mode === 'contragents'), tap(data => console.log('isContragentsMode$: ', data)),
    );
    isDefaultMode$ = this.mode$.pipe(
        map(mode => mode === 'default'),
    );
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
    permissionsRaw$ = this.user$.pipe(
        switchMap(user => this.lkService.getPermissionsByUser(user)),
        tap(data => console.log('getPermissionsByUser: ', data)),
    );
    permSections$ = this.permissionsRaw$.pipe(
        map(permissions => uniq(permissions.map(p => p?.meta?.permission_id?.slug))),
    );
    availableContragents$ = this.permissionsRaw$.pipe(
        map((permissions) =>
            permissions.map(p => ({entId: p.contragent_entity_id, entKey: p.contragent_entity_key}))),
        tap(data => console.log('availableContragents$: ', data)),
    );

    constructor(
        public authService: AuthService,
        private restService: RestService,
        private imageService: ImageService,
        private ar: ActivatedRoute,
        private router: Router,
        private lkService: LkService,
    ) {
        /*
         todo "удалить"
         */
        this.availableContragents$.subscribe();
        this.routeData$.subscribe();
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


