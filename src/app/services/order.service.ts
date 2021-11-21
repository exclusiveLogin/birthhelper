import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {ODRER_ACTIONS, Order, OrderSrc} from '../models/order.interface';
import {Entity, PriceEntitySlot} from '../models/entity.interface';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {hasher} from '../modules/utils/hasher';
import {Subject, Observable} from 'rxjs';
import {summatorPipe} from '../modules/utils/price-summator';
import {SelectionOrderSlot} from '../modules/configurator/configurator.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    userOrdersStore: Order[];
    storeHash: string;
    doListRefresh$ = new Subject<null>();
    doPriceRecalculate$ = new Subject<null>();

    onOrderListChanged$ = this.doListRefresh$.pipe(
        tap(() => console.log('doListRefresh$')),
        switchMap(() => this.fetchCurrentOrders()),
        tap(list => this.smartRefresher(list)),
        map(() => this.userOrdersStore),
        shareReplay(1),
    );

    onOrderListChanged_Pending$ = this.onOrderListChanged$.pipe(
        map(list => list.filter((o) => o.status === 'pending')),
    );

    onSlots$ = this.doPriceRecalculate$.pipe(
        map(() => this.userOrdersStore
                .map(order => order?.slot)
                .filter( _ => !!_ ),
        ),
    );

    onSummaryPriceChanged$ = this.onSlots$.pipe(
        map((slots: PriceEntitySlot[]) => slots.map(slot => slot?.price ?? 0)),
        summatorPipe,
    );

    constructor(
        private restService: RestService,
    ) {
        this.userOrdersStore = [];
        console.log('OrderService', this);
    }

    updateOrderList(): void {
        this.doListRefresh$.next();
    }

    async smartRefresher(ordersList: OrderSrc[]): Promise<void> {
        console.log('smartRefresher', ordersList);
        const hash = hasher(ordersList);
        if (hash === this.storeHash) {
            return;
        }
        this.userOrdersStore.forEach(order => order._status = 'refreshing');
        for (const order of ordersList) {
            const targetOrder = this.userOrdersStore.find(o => o.id === order.id);
            if (targetOrder) {
                targetOrder.update(order);
            } else {
                this.userOrdersStore.push(new Order(order));
            }
        }
        this.userOrdersStore = this.userOrdersStore.filter(o => o._status !== 'refreshing');
        const forUpdateOrders = this.userOrdersStore.filter(o => o._status === 'loading');
        if (forUpdateOrders.length) {
            for (const o of forUpdateOrders) {
                try {
                    o.slot = await this.productFetcher(o.slot_entity_key, o.slot_entity_id).toPromise();
                } catch (e) {
                    o._status = 'error';
                    console.error('fetch slot ERROR: ', e);
                }
            }
        }
        this.storeHash = hasher(this.userOrdersStore.map(o => o.raw));

        this.doPriceRecalculate$.next();
    }

    addIntoCart(selection: SelectionOrderSlot): void {
        this.orderApiAction(ODRER_ACTIONS.ADD, selection)
            .subscribe(() => this.doListRefresh$.next());
    }

    removeOrderFromCart(selection: SelectionOrderSlot): void {
        this.orderApiAction(ODRER_ACTIONS.REMOVE, selection)
            .subscribe(() => this.doListRefresh$.next());
    }

    fetchCurrentOrders(): Observable<OrderSrc[]> {
        return this.restService.getOrdersByCurrentSession()
            .pipe(map(list => list.filter(order => order.status !== 'deleted')));
    }

    orderApiAction(action: ODRER_ACTIONS, selection: SelectionOrderSlot): Observable<any> {
        switch (action) {
            case ODRER_ACTIONS.ADD:
                return this.restService.createOrder(selection);
            default:
                return this.restService.changeOrder(action, selection);

        }
    }

    productFetcher(key: string, id: number): Observable<PriceEntitySlot> {
        return this.restService.getEntity(key, id);
    }

    getPriceBuContragent(contragentId: number): Observable<number> {
        return this.onSlots$.pipe(
            map(slots => slots.filter(slot => slot._contragent.id === contragentId)),
            map((slots: PriceEntitySlot[]) => slots.map(slot => slot?.price ?? 0)),
            map((prices: number[]) => prices.map(price => +price)),
            map((prices: number[]) => prices.filter(price => !!price && !isNaN(price))),
            summatorPipe,
        );
    }
}
