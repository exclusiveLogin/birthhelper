import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {ODRER_ACTIONS, Order, OrderSrc} from '../models/order.interface';
import {PriceEntitySlot} from '../models/entity.interface';
import {map, mapTo, shareReplay, switchMap, tap} from 'rxjs/operators';
import {hasher} from '../modules/utils/hasher';
import {Subject, Observable, of, forkJoin} from 'rxjs';
import {summatorPipe} from '../modules/utils/price-summator';
import {ConfiguratorConfigSrc, SelectionOrderSlot} from '../modules/configurator/configurator.model';
import {uniq} from '../modules/utils/uniq';
import {SectionType} from './search.service';

export type StatusValidation = 'pending' | 'poor' | 'rich' | 'valid';
export type SelectMode = 'multi' | 'single';

export interface ValidationTreeItem {
    key: string;
    selected: number;
    status: StatusValidation;
    required: boolean;
    selectionMode: SelectMode;
    locked: boolean;
}
export interface ValidationTreeContragent {
    contragentHash: string;
    _tabs: ValidationTreeItem[];
    _floors: ValidationTreeItem[];
    _orders: Order[];
    isInvalid: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    validationTree: ValidationTreeContragent[] = [];
    uniqContragentHashes: string[] = [];
    uniqSectionKeys: SectionType[] = [];
    sectionConfigs: { [id in SectionType]?: ConfiguratorConfigSrc} = {};
    userOrdersStore: Order[];
    storeHash: string;
    doListRefresh$ = new Subject<null>();
    doPriceRecalculate$ = new Subject<null>();

    onOrderListChanged$ = this.doListRefresh$.pipe(
        tap(() => console.log('doListRefresh$')),
        switchMap(() => this.fetchCurrentOrders()),
        switchMap(list => this.smartRefresher(list)),
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

    onValidationTreeCompleted$ = this.onOrderListChanged$.pipe(
        tap((orders => this.refreshValidationConfigsHashes(orders))),
        switchMap((orders) => this.updateConfigsBySections().pipe(mapTo(orders))),
        tap(orders => this.updateValidationTreeStructure(orders)),
        tap( () => this.calculateTreeSelections()),
        tap( () => this.calculateTreeStatuses()),
        map(() => this.validationTree),
    );

    constructor(
        private restService: RestService,
    ) {
        this.userOrdersStore = [];
        console.log('OrderService', this);
        this.onValidationTreeCompleted$
            .subscribe((tree) => console.log('onValidationTreeCompleted$ data:', tree) );
    }

    refreshValidationConfigsHashes(orders: Order[]): void {
        // собираем уникальные констрагенты по которым будем группировать заказы (позиции)
        const c_hashes = orders.filter(o => !!o?.slot).map(o => {
            const {_entity_id_key: e_id, _contragent_id_key: c_id} = o.slot;
            return hasher({id: o[c_id], entKey: o[e_id]});
        });
        this.uniqContragentHashes = uniq(c_hashes);

        // собираем уникальные секции в которых учавствуют позиции (нужно для подгрузки конфгов)
        this.uniqSectionKeys = uniq(orders
            .filter(o => o.section_key)
            .map(o => o.section_key)
        ) as SectionType[];
    }

    updateConfigsBySections(): Observable<ConfiguratorConfigSrc[]> {
        if (!this.uniqSectionKeys.length) {
            return of(null);
        }
        return forkJoin([
            ...this.uniqSectionKeys.map(section => this.restService.getConfiguratorSettings(section))
        ]).pipe(
            tap((cfgs) => {
                this.sectionConfigs = {};
                cfgs.forEach((cfg, idx) => this.sectionConfigs[this.uniqSectionKeys[idx]] = cfg);
            })
        );
    }

    updateValidationTreeStructure(orders: Order[]): void {
        this.validationTree = this.uniqContragentHashes.map(hash => {
            const currentContragentOrders = orders.filter(o => o?.slot?.[o.slot._contragent_id_key]);
            if (!currentContragentOrders.length) { return ; }
            const targetCfgKey = currentContragentOrders[0].section_key;
            const targetCfg = this.sectionConfigs[targetCfgKey];
            if (!targetCfg) { return ; }
            const contragentTabs = targetCfg?.tabs ?? [];
            const contragentFloors = targetCfg?.tabs?.reduce(
                (floors, tab) => ([...floors, ...tab.floors]), []) ?? [];
            return {
                contragentHash: hash,
                _tabs: contragentTabs.map(tab => {
                    return {
                        key: tab.key,
                        required: tab?.required ?? false,
                        selected: 0,
                        selectionMode: tab?.selectMode ?? 'multi',
                        status: 'pending',
                        locked: false,
                    } as ValidationTreeItem;
                }) ?? [],
                _floors: contragentFloors.map(floor => {
                    return {
                        key: floor.key,
                        required: floor?.required ?? false,
                        selected: 0,
                        selectionMode: floor?.selectMode ?? 'multi',
                        status: 'pending',
                        locked: false,
                    } as ValidationTreeItem;
                }) ?? [],
                _orders: currentContragentOrders,
                isInvalid: false,
            };
        }).filter(_ => !!_);
    }

    calculateTreeSelections(): void {
        for (const contragentTree of this.validationTree) {
            contragentTree._orders.forEach(order => {
                contragentTree._tabs.forEach(tab => tab.selected = order.tab_key === tab.key
                    ? tab.selected + 1
                    : tab.selected);
                contragentTree._floors.forEach(floor => floor.selected = order.floor_key === floor.key
                    ? floor.selected + 1
                    : floor.selected);
            });
        }
    }

    calculateTreeStatuses(): void {
        for (const contragentTree of this.validationTree) {
            contragentTree._tabs.forEach(tab => {
                tab.status = 'valid';
                if (tab.selected === 0) {
                    tab.status =  tab.required ? 'poor' : 'valid';
                }
                if (tab.selected >= 1) {
                    tab.locked = tab.selectionMode === 'single';
                }
                if (tab.selected > 1) {
                    tab.status = tab.selectionMode === 'single' ? 'rich' : 'valid';
                }
                if (tab.status !== 'valid') {
                    contragentTree.isInvalid = true;
                }
            });
            contragentTree._floors.forEach(floor => {
                floor.status = 'valid';
                if (floor.selected === 0) {
                    floor.status =  floor.required ? 'poor' : 'valid';
                }
                if (floor.selected >= 1) {
                    floor.locked = floor.selectionMode === 'single';
                }
                if (floor.selected > 1) {
                    floor.status = floor.selectionMode === 'single' ? 'rich' : 'valid';
                }
                if (floor.status !== 'valid') {
                    contragentTree.isInvalid = true;
                }
            });
        }
    }

    updateOrderList(): void {
        this.doListRefresh$.next();
    }

    getValidationTreeByContragent(contragentId: number, contragentEntityKey: string): Observable<ValidationTreeContragent> {
        const hash =  hasher({id: contragentId, entKey: contragentEntityKey});
        return this.onValidationTreeCompleted$.pipe(
            map(tree => tree.find(t => t.contragentHash === hash)));
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
