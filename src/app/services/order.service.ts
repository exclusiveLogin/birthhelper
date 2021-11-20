import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {SectionType} from './search.service';
import {ODRER_ACTIONS, Order, OrderSrc} from '../models/order.interface';
import {Entity, SlotEntity} from '../models/entity.interface';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {hasher} from '../modules/utils/hasher';
import {Subject, Observable} from 'rxjs';

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

    onPriceChanged$ = this.doPriceRecalculate$.pipe();

    onOrdersProductRefreshed$ = this.doPriceRecalculate$.pipe();

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
        let listChanged = false;
        const hash = hasher(ordersList);
        if (hash === this.storeHash) { return; }
        this.userOrdersStore.forEach(order => order._status = 'refreshing');
        for (const order of ordersList) {
            const targetOrder = this.userOrdersStore.find(o => o.id === order.id);
            if ( targetOrder ) {
                targetOrder.update(order);
            } else {
                this.userOrdersStore.push(new Order(order));
            }
        }
        // clear repository
        if (this.userOrdersStore.filter(o => o._status === 'refreshing').length) {
            listChanged = true;
        }

        this.userOrdersStore = this.userOrdersStore.filter(o => o._status !== 'refreshing');
        const forUpdateOrders = this.userOrdersStore.filter(o => o._status === 'loading');
        if ( forUpdateOrders.length ) {
            for (const o of forUpdateOrders) {
                try {
                    o.slot = await this.productFetcher(o.slot_entity_key, o.slot_entity_id).toPromise();
                } catch (e) {
                    o._status = 'error';
                    console.error('fetch slot ERROR: ', e);
                }
            }
        }
        this.storeHash = hasher( this.userOrdersStore.map(o => o.raw) );
    }

    fetcherFactory(order: OrderSrc): Observable<any> {
        return ;
    }

    getPriceByContragent(section: SectionType, id: number): Observable<any> {
        return ;
    }

    addIntoCart(slotKey: string, slotId: number): void {
        this.orderApiAction(ODRER_ACTIONS.ADD, null, slotKey, slotId)
            .subscribe(() => this.doListRefresh$.next());
    }

    removeOrderFromCartByID(order: Entity): void {
        this.orderApiAction(ODRER_ACTIONS.REMOVE, order)
            .subscribe(() => this.doListRefresh$.next());
    }

    removeOrderFromCartByEntity(order: Entity): void {
        this.orderApiAction(ODRER_ACTIONS.REMOVE, null, order.entKey, order.id)
            .subscribe(() => this.doListRefresh$.next());
    }

    fetchCurrentOrders(): Observable<OrderSrc[]> {
        return this.restService.getOrdersByCurrentSession()
            .pipe(map(list => list.filter(order => order.status !== 'deleted')));
    }

    orderApiAction(action: ODRER_ACTIONS, order?: Entity, entityKey?: string, entityId?: number): Observable<any> {
        const _ = order ? order : { id: null, ent_key: entityKey, ent_id: entityId, action} as Entity;
        switch (action) {
            case ODRER_ACTIONS.ADD:
                return this.restService.createOrder(entityKey, entityId);
            default:
                return this.restService.changeOrder(action, _);

        }
    }

    productFetcher(key: string, id: number): Observable<SlotEntity> {
        return this.restService.getEntity(key, id);
    }
}
