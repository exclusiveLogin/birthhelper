import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RestService} from '../../../../services/rest.service';
import {NotifierService} from '../../../notifier/notifier.service';
import {of} from 'rxjs/internal/observable/of';
import {ApiService} from '../../../../services/api.service';
import {map, mergeAll, tap} from 'rxjs/operators';
import {timer} from 'rxjs/internal/observable/timer';
import {merge} from 'rxjs';

@Component({
    selector: 'app-activation',
    templateUrl: './activation.component.html',
    styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private rest: RestService,
        public notifier: NotifierService,
        private api: ApiService,
        private routing: Router,
    ) {
    }

    url: string;
    code: string;
    stream$ = of(null);

    activate(): void {
        if (!this.code) return;
        this.stream$ = this.rest.activateUser(this.code).pipe(
            map((result) => merge(
                timer(5000).pipe(tap(() => this.routing.navigate(['/']))),
                of(result))
            ),
            mergeAll()
        );
    }


    ngOnInit(): void {
        this.code = this.route.snapshot?.queryParams?.code;
        this.url = this.code ? `${this.api.getApiPath()}/auth/activation/${this.code}` : null;
    }

}
