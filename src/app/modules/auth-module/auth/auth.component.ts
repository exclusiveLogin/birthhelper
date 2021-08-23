import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import md5 from 'md5';
import {NotifierService} from '../../notifier/notifier.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        public notifier: NotifierService,
    ) {
    }

    mode: 'auth' | 'registration' = 'auth';

    login: string;
    _password: string;
    _pwd_md5: string;

    set password(value) {
        this._password = value;
        this._pwd_md5 = md5(value);
    }

    password2: string;

    get password(): string {
        return this._password;
    }

    toggleToRegistrationMode(): void {
        this.mode = 'registration';
    }

    toggleToAuthMode(): void {
        this.mode = 'auth';
    }

    signin(): void {
        console.log('signin', this);
        const url = this.route.snapshot.queryParamMap.get('url');
        // this.router.navigate([], {queryParams: {url: null}}).then();
        this.authService.login(this.login, this._pwd_md5, url);
    }

    signup(): void {
        console.log('sign up', this);
        // const url = this.route.snapshot.queryParamMap.get('url');
        // this.router.navigate([], {queryParams: {url: null}}).then();
        // this.authService.login(this.login, this._pwd_md5, url);
    }

    ngOnInit() {

    }

}
