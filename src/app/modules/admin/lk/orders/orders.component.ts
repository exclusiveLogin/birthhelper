import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LkService} from '@services/lk.service';
import {RestService} from '@services/rest.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
    selectedCTG$ = this.lkService.selectedContragents$;

    constructor(
        private restService: RestService,
        private lkService: LkService,
    ) {
    }
}
