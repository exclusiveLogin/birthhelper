import {Component, OnInit} from '@angular/core';
import {DictService} from './dict.service';
import {LoaderService} from './loader.service';
import {AuthService} from '../modules/auth-module/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './Admin.component.html',
    styleUrls: ['./Admin.component.css']
})
export class AdminComponent implements OnInit {

    constructor(
        private dct: DictService,
        private loader: LoaderService,
        private auth: AuthService,
        private router: Router,
    ) {
    }

    ngOnInit() {

    }

    public async exit() {
        await this.router.navigate(['/']);
        this.auth.logout();
    }

    public get isLoading(): boolean {
        return this.loader.state;
    }

    public get isError(): boolean {
        return this.loader.error;
    }

    public get hasErrorText(): boolean {
        return !!this.loader.errorText;
    }

    public get errorText(): string {
        return this.loader.errorText;
    }
}
