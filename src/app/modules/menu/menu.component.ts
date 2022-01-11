import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth-module/auth.service';
import {combineLatest, Observable} from 'rxjs';
import {User} from '../../models/user.interface';
import {filter, map, pluck, shareReplay, switchMap, tap} from 'rxjs/operators';
import {IImage} from '../../Admin/Dashboard/Editor/components/image/image.component';
import {RestService} from '../../services/rest.service';
import {ImageService} from '../../services/image.service';
import {ActivatedRoute} from '@angular/router';
import {LkService} from '../../services/lk.service';
import {Permission, PermissionMap, PermissionSetting} from '../../models/lk.permission.interface';

type MenuMode = 'default' | 'lk';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    routeData$ = this.ar.data.pipe(
        tap(data => console.log('routeData: ', data)),
        pluck('mode'),
    );
    mode$: Observable<MenuMode> = this.routeData$.pipe(
        tap(data => console.log('routeDataMode: ', data)),
        map(data => data === 'lk' ? 'lk' : 'default'),
    );
    isLKMode$ = this.mode$.pipe(
        map(mode => mode === 'lk'),
    );
    isDefaultMode$ = this.mode$.pipe(
        map(mode => mode === 'default'),
    );
    onLKMode$ = this.mode$.pipe(
        filter(mode => mode === 'lk'),
    );
    onDefaultMode$ = this.mode$.pipe(
        filter(mode => mode === 'default'),
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
    permissionsRaw$ = combineLatest([this.onLKMode$, this.user$]).pipe(
        tap(data => console.log('permissionsRaw$: ', data)),
        map(data => data[1]),
        switchMap(user => this.lkService.getPermissionsByUser(user)),
        tap(data => console.log('getPermissionsByUser: ', data)),
    );

    constructor(
        public authService: AuthService,
        private restService: RestService,
        private imageService: ImageService,
        private ar: ActivatedRoute,
        private lkService: LkService,
    ) {
        /*
         todo "удалить"
         */
        this.permissionsRaw$.subscribe();
    }

    getUserName(user: User): string {
        return `${user.first_name || ''} ${user.last_name || ''}`;
    }
    ngOnInit(): void {
    }

    getPoint(perm: Permission): PermissionSetting {
        return PermissionMap[perm?.meta?.permission_id?.slug];
    }

}
