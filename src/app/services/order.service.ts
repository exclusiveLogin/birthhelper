import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {ODRER_ACTIONS, Order, OrderSrc} from '../models/order.interface';
import {PriceEntitySlot} from '../models/entity.interface';
import {map, mapTo, shareReplay, switchMap, tap} from 'rxjs/operators';
import {hasher} from '../modules/utils/hasher';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import {summatorPipe} from '../modules/utils/price-summator';
import {ConfiguratorConfigSrc, SelectionOrderSlot, TabConfig, TabFloorSetting} from '../modules/configurator/configurator.model';
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
    message: string;
}
export interface ValidationTreeContragent {
    contragentHash: string;
    sections: SectionType[];
    sectionConfigs: ConfiguratorConfigSrc[];
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
    contragentHashMap: {[hash: string]: {id: number, entKey: string}};
    uniqSectionKeys: SectionType[] = [];
    sectionConfigs: { [id in SectionType]?: ConfiguratorConfigSrc} = {};
    userOrdersStore: Order[];
    storeHash: string;
    doListRefresh$ = new Subject<null>();
    doPriceRecalculate$ = new Subject<null>();

    onOrderListChanged$ = this.doListRefresh$.pipe(
        switchMap(() => this.fetchCurrentOrders()),
        tap(list => this.smartRefresher(list)),
        map(() => this.userOrdersStore),
        shareReplay(1),
    );

    onOrderListChanged_Pending$ = this.onOrderListChanged$.pipe(
        map(list => list.filter((o) => o.status === 'pending')),
        shareReplay(1),
    );

    onSlots$ = this.doPriceRecalculate$.pipe(
        map(() => this.userOrdersStore
                .map(order => order?.slot)
                .filter( _ => !!_ ),
        ),
        shareReplay(1),
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
        shareReplay(1),
    );

    constructor(
        private restService: RestService,
    ) {
        this.userOrdersStore = [];
        this.onValidationTreeCompleted$
            .subscribe((tree) => console.log('onValidationTreeCompleted$ data:', tree, this.contragentHashMap) );

        this.onSummaryPriceChanged$.subscribe();
        this.updateOrderList();
    }

    private refreshValidationConfigsHashes(orders: Order[]): void {
        // собираем уникальные констрагенты по которым будем группировать заказы (позиции)
        this.contragentHashMap = {};
        const c_hashes = orders.filter(o => !!o?.contragent_entity_key && !!o?.contragent_entity_id).map(o => {
            const body = {id: o.contragent_entity_id, entKey: o.contragent_entity_key};
            const hash = hasher(body);
            this.contragentHashMap[hash] = body;
            return hash;
        });
        this.uniqContragentHashes = uniq(c_hashes);

        // собираем уникальные секции в которых учавствуют позиции (нужно для подгрузки конфгов)
        this.uniqSectionKeys = uniq(orders
            .filter(o => o.section_key)
            .map(o => o.section_key)
        ) as SectionType[];
    }

    private updateConfigsBySections(): Observable<ConfiguratorConfigSrc[]> {
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

    private updateValidationTreeStructure(orders: Order[]): void {
        this.validationTree = this.uniqContragentHashes.map(hash => {
            const currentContragentOrders = orders.filter(o => {
                const body = { id: o.contragent_entity_id, entKey: o.contragent_entity_key };
                return hasher(body) === hash;
            });
            if (!currentContragentOrders.length) { return ; }
            const targetCfgKeys: SectionType[] = uniq(currentContragentOrders.map(o => o.section_key)) as SectionType[];
            const targetCfgs: ConfiguratorConfigSrc[] = targetCfgKeys.map(k => this.sectionConfigs[k]);

            if (!targetCfgs.length) { return ; }

            const contragentTabs = targetCfgs.reduce((tabs, cfg) => ([...tabs, ...cfg.tabs]) , [] as TabConfig[]);
            const contragentFloors = (contragentTabs.reduce(
                (floors, tab) => ([...floors, ...tab.floors]), [] as TabFloorSetting[]) ?? []) as TabFloorSetting[];
            currentContragentOrders.forEach(order => {
                const o_type = contragentFloors?.find(f => f.key === order.floor_key)?.entityType;
                order.setUtility(o_type);
            });
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
                        message: '',
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
                        message: '',
                    } as ValidationTreeItem;
                }) ?? [],
                _orders: currentContragentOrders,
                isInvalid: false,
                sections: targetCfgKeys,
                sectionConfigs: targetCfgs,
            };
        }).filter(_ => !!_);
    }

    private calculateTreeSelections(): void {
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

    private calculateTreeStatuses(): void {
        for (const contragentTree of this.validationTree) {
            const cfgs = contragentTree.sectionConfigs;
            const contragentTabs = cfgs.reduce((tabs, cfg) => ([...tabs, ...cfg.tabs]) , [] as TabConfig[]);

            contragentTree._tabs.forEach(tab => {
                const tabConfig = contragentTabs?.find(t => tab.key === t.key);
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
                    tab.message = tab.status === 'poor'
                        ? tabConfig?.poorErrorMessage || tabConfig?.defaultMessage || 'Выберите хотя бы один пункт'
                        : tabConfig?.richErrorMessage || tabConfig?.defaultMessage || 'Может быть выбран только один пункт';
                    contragentTree.isInvalid = true;
                }
                if (tab.locked && tab.status === 'valid') {
                    tab.message = tabConfig.lockMessage || '';
                }
            });
            contragentTree._floors.forEach(floor => {
                const floorConfigs = contragentTabs?.reduce(
                    (floors, tab) => ([...floors, ...tab.floors]), [] as TabFloorSetting[]);
                const targetConfig = floorConfigs.find(f => f.key === floor.key);
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
                    floor.message = floor.status === 'poor'
                        ? targetConfig?.poorErrorMessage || targetConfig?.defaultMessage || 'Выберите хотя бы один пункт'
                        : targetConfig?.richErrorMessage || targetConfig?.defaultMessage || 'Может быть выбран только один пункт';
                    contragentTree.isInvalid = true;
                }
                if (floor.locked && floor.status === 'valid') {
                    floor.message = targetConfig.lockMessage || '';
                }
            });
        }
    }

    getValidationTreeByContragent(contragentId: number, contragentEntityKey: string): Observable<ValidationTreeContragent> {
        const hash =  hasher({id: contragentId, entKey: contragentEntityKey});
        return this.onValidationTreeCompleted$.pipe(
            map(tree => tree.find(t => t.contragentHash === hash)));
    }

    smartRefresher(ordersList: OrderSrc[]): void {
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
            forkJoin(forUpdateOrders
                .filter(o => o.slot_entity_key && o.slot_entity_id)
                .map(o => this.productFetcher(o.slot_entity_key, o.slot_entity_id).pipe(
                    tap(
                        (slot) => o.setSlot(slot),
                        (e) => {
                            o._status = 'error';
                            console.error('fetch slot ERROR: ', e);
                    }))))
                .subscribe(_ => this.doPriceRecalculate$.next());
        }
        this.storeHash = hasher(this.userOrdersStore.map(o => o.raw));
        this.doPriceRecalculate$.next();
    }

    addIntoCart(selection: SelectionOrderSlot): void {
        this.orderApiAction(ODRER_ACTIONS.ADD, selection)
            .subscribe(() => this.doListRefresh$.next());
    }

    submitCart(payload: SelectionOrderSlot): void {
        this.orderApiAction(ODRER_ACTIONS.SUBMIT, payload)
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

    orderApiAction(action: ODRER_ACTIONS, selection?: SelectionOrderSlot): Observable<any> {
        switch (action) {
            case ODRER_ACTIONS.ADD:
                return this.restService.createOrder(selection);
            case ODRER_ACTIONS.CLEAR:
                return this.restService.changeOrder(action);
            default:
                return this.restService.changeOrder(action, selection);

        }
    }

    productFetcher(key: string, id: number): Observable<PriceEntitySlot> {
        return this.restService.getEntity(key, id);
    }

    getPriceByContragent(contragentId: number): Observable<number> {
        return this.onSlots$.pipe(
            map(slots => slots.filter(slot => slot._contragent.id === contragentId)),
            map((slots: PriceEntitySlot[]) => slots.map(slot => slot?.price ?? 0)),
            map((prices: number[]) => prices.map(price => +price)),
            map((prices: number[]) => prices.filter(price => !!price && !isNaN(price))),
            summatorPipe,
        );
    }

    updateOrderList(): void {
        this.doListRefresh$.next();
    }

    clearCart(): void {
        this.orderApiAction(ODRER_ACTIONS.CLEAR).subscribe(() => this.updateOrderList());
    }
}
