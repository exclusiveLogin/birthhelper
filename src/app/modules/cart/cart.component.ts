import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {RestService} from '../../services/rest.service';
import {of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Clinic, IClinicSrc} from '../../models/clinic.interface';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    validationTree$ = this.orderService.onValidationTreeCompleted$.pipe(tap((c => console.log(c))));

    constructor(
        private orderService: OrderService,
        private restService: RestService,
        ) {}

    ngOnInit(): void {
    }

    getClinicContragentByHash(hash: string) {
        const contragentData = this.orderService.contragentHashMap[hash];
        return contragentData
            ? this.restService.getEntity<IClinicSrc>(contragentData.entKey, contragentData.id)
                .pipe(map(c => Clinic.createClinicMini(c)))
            : of(null);
    }

}
