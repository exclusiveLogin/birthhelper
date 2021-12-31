import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../modules/auth-module/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }
    ngOnInit(): void {
    }

    async logout() {
        await this.router.navigate(['/']);
        this.authService.logout();
    }

}
