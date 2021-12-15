import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {RestService} from '../../services/rest.service';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    validationTree$ = this.orderService.onValidationTreeCompleted$.pipe(
        tap((c => console.log(c))),
    );

    constructor(
        private orderService: OrderService,
        ) {}

    ngOnInit(): void {
    }



}
