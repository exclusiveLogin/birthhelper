import {Component, OnInit} from '@angular/core';
import {AuthService} from '../modules/auth-module/auth.service';
import {Observable} from 'rxjs';
import {User} from '../models/user.interface';
import {filter, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {IImage} from '../Admin/Dashboard/Editor/components/image/image.component';
import {RestService} from '../services/rest.service';
import {ImageService} from '../services/image.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    constructor(
        public authService: AuthService,
        private restService: RestService,
        private imageService: ImageService,
    ) {
    }

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

    getUserName(user: User): string {
        return `${user.first_name || ''} ${user.last_name || ''}`;
    }
    ngOnInit(): void {
    }

}
