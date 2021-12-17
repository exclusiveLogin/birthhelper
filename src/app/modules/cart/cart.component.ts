import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {OrderService, ValidationTreeContragent} from '../../services/order.service';
import {map, tap} from 'rxjs/operators';
import {Order} from 'app/models/order.interface';
import {summatorPipe} from 'app/modules/utils/price-summator';
import {ConfiguratorService} from 'app/modules/configurator/configurator.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {

    validationTree$ = this.orderService.onValidationTreeCompleted$.pipe(
        tap((c => console.log(c))),
    );

    totalPrice$ = this.validationTree$.pipe(
        map(tree => tree.reduce((keys, cur) => [...keys, ...cur._orders], [] as Order[])),
        map(orders => orders.map(o => o?.slot?.price ?? 0)),
        map((prices: number[]) => prices.map(price => +price)),
        map((prices: number[]) => prices.filter(price => !!price && !isNaN(price))),
        summatorPipe,
    );

    totalPriceValid$ = this.validationTree$.pipe(
        map(tree => tree.filter(t => !t.isInvalid)),
        map(tree => tree.reduce((keys, cur) => [...keys, ...cur._orders], [] as Order[])),
        map(orders => orders.map(o => o?.slot?.price ?? 0)),
        map((prices: number[]) => prices.map(price => +price)),
        map((prices: number[]) => prices.filter(price => !!price && !isNaN(price))),
        summatorPipe,
    );

    constructor(
        private orderService: OrderService,
        private configurator: ConfiguratorService,
        ) {}

    ngOnInit(): void {
    }

    trackIt(idx: number, vt: ValidationTreeContragent): string {
        return vt.contragentHash;
    }

    clearCart(): void {
        const p = confirm('Вы действительно хотите отчистить корзину?');
        if (!p) { return; }
        this.configurator.clearAllSelections();
        this.orderService.clearCart();
    }
}
