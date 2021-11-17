import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {SectionType} from './search.service';
import {ODRER_ACTIONS, Order, OrderSrc} from '../models/order.interface';
import {SlotEntity} from '../models/entity.interface';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(
        private restService: RestService,
    ) {
        this.userOrdersStore = [];
    }

    userOrdersStore: Order[];
    doOrdersRefresh$ = new Subject<null>();
    doListRefresh$ = new Subject<null>();
    doCheckProducts$ = new Subject<null>();
    doPriceRecalculate$ = new Subject<null>();

    onPriceChanged$ = this.doPriceRecalculate$.pipe();
    onOrderListChanged$ = this.doPriceRecalculate$.pipe();
    onOrdersProductRefreshed$ = this.doPriceRecalculate$.pipe();
    smartRefresher(): void {

    }

    fetcherFactory(order: OrderSrc): Observable<any> {
        return ;
    }

    getPriceByContragent(section: SectionType, id: number): Observable<any> {
        return ;
    }

    addIntoCart(slotKey: string, slotId: number): Observable<any> {
        return this.orderApiAction(ODRER_ACTIONS.ADD, null, slotKey, slotId);
    }

    removeOrderFromCart(order: Order): Observable<any> {
        return this.orderApiAction(ODRER_ACTIONS.REMOVE, order);
    }

    fetchCurrentOrders(): Observable<OrderSrc[]> {
        return this.restService.getOrdersByCurrentSession();
    }

    orderApiAction(action: ODRER_ACTIONS, order?: Order, entityKey?: string, entityId?: number): Observable<any> {
        switch (action) {
            case ODRER_ACTIONS.ADD:
                return this.restService.createOrder(entityKey, entityId);
            default:
                return this.restService.changeOrder(action, order);

        }
    }

    productFetcher(key: string, id: number): Observable<SlotEntity> {
        return this.restService.getEntity(key, id);
    }
}
