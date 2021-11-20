import {Injectable} from '@angular/core';
import {SectionType} from 'app/services/search.service';
import {
    BehaviorSubject,
    Observable,
    Subject,
    combineLatest,
    zip,
    NEVER,
    merge
} from 'rxjs';
import {
    ConfiguratorConfigSrc,
    DataStore, SelectedState, SelectionOrderSlot,
    SelectionStore,
    TabConfig, TabRxInput,
    TabsStore,
    ViewStore
} from 'app/modules/configurator/configurator.model';

import {RestService} from 'app/services/rest.service';
import {Entity, SlotEntity} from 'app/models/entity.interface';
import {filter, map, mapTo, shareReplay, switchMap, tap} from 'rxjs/operators';
import {hasher} from '../utils/hasher';
import {OrderService} from '../../services/order.service';
import {Order} from '../../models/order.interface';

@Injectable({
    providedIn: 'root'
})
export class ConfiguratorService {

    constructor(
        private restService: RestService,
        private orderService: OrderService,
    ) {
        console.log('ConfiguratorService', this);
        this.orderService.onOrderListChanged_Pending$.subscribe(list => this.syncOrders(list));
        this.orderService.updateOrderList();
    }

    private _config: ConfiguratorConfigSrc;

    currentContragentID$ = new BehaviorSubject<number>(null);
    currentContragentEntityKey$ = new BehaviorSubject<string>(null);
    currentSectionKey$ = new BehaviorSubject<SectionType>(null);

    private providers: DataStore = {};
    private buses: DataStore = {};
    private consumers: DataStore = {};

    private tabsStore: TabsStore = {};
    private selectionStore: SelectionStore = {};
    private viewsStore: ViewStore = {};

    private _currentTab$ = new Subject<string>();
    private _selection$ = new Subject<[e: Entity, tab: string]>();
    private _syncOrders$ = new Subject<null>();

    onContragent$ = combineLatest([this.currentContragentID$, this.currentContragentEntityKey$]).pipe(
        tap(() => this.selectionStore = {}),
        filter(([id, key]) => !!id && !!key),
        switchMap(([id, key]) => this.restService.getEntity(key, id)),
    );

    onConfigLoad$: Observable<ConfiguratorConfigSrc> =
        combineLatest([this.currentContragentID$, this.currentContragentEntityKey$, this.currentSectionKey$]).pipe(
            filter(([id, entKey, section]) => !!id && !!entKey && !!section),
            switchMap(([id, entKey, section]) => this.restService.getConfiguratorSettings(section)),
            tap(config => this._config = config),
        );

    onSynced$: Observable<null> = this._syncOrders$.pipe();

    onProvidersReady$ = this.onConfigLoad$.pipe(tap(() => this.providerLayerFactory()));
    onBusesReady$ = this.onProvidersReady$.pipe(tap(() => this.busLayerFactory()));
    onConsumersReady$ = this.onBusesReady$.pipe(tap(() => this.consumerLayerFactory()));
    onViewReady$ = this.onConsumersReady$.pipe(tap(() => this.viewLayerFactory()));
    onTabsReady$: Observable<TabRxInput[]> =
        this.onViewReady$.pipe(
            tap(() => this.tabLayerFactory()),
            map(() => Object.values(this.tabsStore)),
        );

    onViewChanged$: Observable<TabConfig> = this._currentTab$.pipe(
        filter(key => !!this.viewsStore[key]),
        map(key => this.viewsStore[key]));

    onSelectionByUser$: Observable<null> = this._selection$.pipe(
        tap(([item, tab]) => {
            // store
            const hash = hasher(item);
            const selection: SelectionOrderSlot = { ...item, _status: 'selected'};

            const operation: 'add' | 'remove' = this.selectionStore[hash] ? 'remove' : 'add';
            this.selectionStore[hash] = operation === 'remove' ? null : selection;

            // tabs
            // const idxOfHash = this.tabsStore[tab].selectedHashes.indexOf(hash);
            // if (idxOfHash >= 0) {
            //     // if exist hash in tab
            //     this.tabsStore[tab].selectedHashes.splice(idxOfHash, 1);
            // } else {
            //     this.tabsStore[tab].selectedHashes.push(hash);
            // }
            operation === 'add'
                ? this.orderService.addIntoCart(item.entKey, item.id)
                : this.orderService.removeOrderFromCartByEntity(item);
        }),
        mapTo(null),
    );

    onSelection$: Observable<SelectionStore> = merge(this.onSynced$, this.onSelectionByUser$).pipe(
        map(() => this.selectionStore),
        shareReplay(1)
    );

    syncOrders(list: Order[]): void {
        let needRefresh = false;
        for (const order of list) {
            const hash = hasher({id: order.slot_entity_id, entKey: order.slot_entity_key});
            const selection = this.selectionStore[hash];
            if (selection) {
                // если товар есть в корзине и в выбранном
                if (selection._status === 'selected') {
                    needRefresh = true;
                    selection._status = 'confirmed';
                }
            } else {
                // если товар не выбран но есть в корзине
                needRefresh = true;
                this.selectionStore[hash] = {
                    ...{
                        id: order.slot_entity_id,
                        entKey: order.slot_entity_key
                    },
                    _status: 'confirmed'
                };
            }
            // проверяем если товара нет в корзине но он почему то выбран
            Object.entries(this.selectionStore).forEach(([__hash, __selection]) => {
                if (__selection?._status === 'selected') {
                    needRefresh = true;
                    this.selectionStore[__hash] = null;
                }
            });
        }
        if (needRefresh) {
            this._syncOrders$.next();
        }
    }

    getConsumerByID(key: string): Observable<SlotEntity[]> {
        return this.consumers[key] ?? NEVER;
    }

    tabLayerFactory(): void {
        this._config.tabs.forEach(tc => {
            const tabConsumersKeys = tc.floors.map(f => f.consumerKeys).reduce((keys, cur) => [...keys, ...cur], []);
            const consumers: Observable<SlotEntity[]>[] = tabConsumersKeys.map(k => this.consumers[k]);
            this.tabsStore[tc.key] = {
                key: tc.key,
                title: tc.title,
                inEnabled$: zip(...consumers).pipe(
                    map(data => data.reduce((keys, cur) => [...keys, ...cur], [])),
                    map(ents => !!ents.length),
                    tap((d) => console.log(`[tabkey: ${tc.key}] inEnabled$ `, d)),
                ),
                inCount$: zip(...consumers).pipe(
                    map(data => data.reduce((keys, cur) => [...keys, ...cur], [])),
                    map(ents => ents.length),
                    tap((d) => console.log(`[tabkey: ${tc.key}] inCount$ `, d)),
                ),
                // inSelected$: this.onSelection$.pipe(map(() => this.tabsStore[tc.key].selectedHashes.length)),
                // selectedHashes: [],
            };
        });
    }

    viewLayerFactory(): void {
        this._config.tabs.forEach(tcfg => this.viewsStore[tcfg.key] = tcfg);
    }

    providerLayerFactory(): void {
        const config = this._config;
        const providerConfigs = config?.providers ?? [];
        providerConfigs.forEach(_ => {
            this.providers[_.key] = this.restService.getSlotsByContragent<SlotEntity>(
                _.entityKey,
                this.currentContragentID$.value,
                _.restrictors ?? []
            );
        });
    }

    busLayerFactory(): void {
        const config = this._config;
        const uniqBusKeys = config.providers
            .map((providerConfig) => providerConfig.busKey)
            .filter((value, index, _arr) => _arr.indexOf(value) === index);

        uniqBusKeys.forEach(key => {
            const t_configs = config.providers.filter(c => c.busKey === key);
            const t_providers = t_configs.map(cfg => this.providers[cfg.key]);
            this.buses[key] = combineLatest(...[t_providers]).pipe(
                map(data => data.reduce((e, acc) => ([...acc, ...e]), [])),
                shareReplay(1)
            );
        });
    }

    consumerLayerFactory(): void {
        const config = this._config;

        config.consumers.forEach(cfg => {
            const t_bus = this.buses[cfg.busKey];
            this.consumers[cfg.key] = t_bus.pipe(
                map(list => list.map(ent => ({...ent, _entity_key: cfg.entityKey} as SlotEntity))),
                // map(list => list.map(ent => ({...ent, photo_url: ent?._entity?.meta?.image_id?.filename ?? 'nophoto'}))),
            );
        });

    }

    selectTab(tabKey: string): void {
        this._currentTab$.next(tabKey);
    }

    selectItem(entity: Entity, tabKey: string): void {
        const data: { id: number, entKey: string } = { id: entity.id, entKey: entity._entity_key};
        this._selection$.next([data, tabKey]);
    }

    getSelectedStateByEntity(entity: Entity): SelectedState {
        const data: { id: number, entKey: string } = { id: entity.id, entKey: entity._entity_key };
        const hash = hasher(data);
        const target = this.selectionStore[hash];
        return target?._status ?? 'unselected';
    }
}
