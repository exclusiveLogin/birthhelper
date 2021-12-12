import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../modules/auth-module/auth.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {

    path = location.pathname;

    constructor( public auth: AuthService) {
    }

    ngOnInit(): void {
    }

}
