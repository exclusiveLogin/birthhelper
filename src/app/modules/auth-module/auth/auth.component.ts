import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import md5 from 'md5';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    encripter;
    public token: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
    ) {
    }

    login: string;
    _password: string;
    _pwd_md5: string;
    set password(value) {
        this._password = value;
        this._pwd_md5 = md5(value);
    }

    get password(): string {
        return this._password;
    }

    signin(): void {
        console.log('signin', this);
        const url = this.route.snapshot.queryParamMap.get('url');
        this.authService.login(this.login, this._pwd_md5, url);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(qp => {
            this.token = qp['token'];

            if (this.token) {
                localStorage.setItem('bh_secure', JSON.stringify({user: 'demo', token: this.token}));
                setTimeout(() => this.router.navigate(['admin']), 3000);
            }
        });
    }

}
