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
import {distinctUntilChanged, filter, map, mapTo, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {hasher} from '../utils/hasher';
import {OrderService, ValidationTreeItem} from '../../services/order.service';
import {Order} from '../../models/order.interface';

@Injectable({
    providedIn: 'root'
})
export class ConfiguratorService {

    constructor(
        private restService: RestService,
        private orderService: OrderService,
    ) {
        this.orderService.onOrderListChanged_inCart$.subscribe(list => this.syncOrders(list));
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
    private _selection$ = new Subject<SelectionOrderSlot>();
    private _syncOrders$ = new Subject<null>();

    onContragentDataLoad$ = combineLatest([this.currentContragentID$, this.currentContragentEntityKey$, this.currentSectionKey$])
        .pipe(
            map(([id, cid, sid]) => ({contragentId: id, contragentEntityKey: cid, contragentSectionKey: sid})));

    onSectionChanged$ = this.onContragentDataLoad$.pipe(
        tap(() => {
            this.tabsStore = {};
            this.selectionStore = {};
            this.viewsStore = {};
        }),
        map(data => data.contragentSectionKey),
        distinctUntilChanged(),
        shareReplay(1),
    );

    onContragent$ = this.onContragentDataLoad$.pipe(
        filter((cfg) => !!cfg?.contragentId && !!cfg?.contragentEntityKey),
        switchMap((cfg) => this.restService.getEntity(cfg.contragentEntityKey, cfg.contragentId)),
        shareReplay(1),
    );

    onConfigLoad$: Observable<ConfiguratorConfigSrc> = this.onSectionChanged$.pipe(
        filter((section) => !!section),
        distinctUntilChanged((pre, cur) => pre === cur),
        switchMap(section => this.restService.getConfiguratorSettings(section)),
        tap(config => this._config = config),
        tap((config) => this._currentTab$.next(config?.tabs[0]?.key)),
        shareReplay(1),
    );

    onSynced$: Observable<null> = this._syncOrders$.pipe();

    onValidationTreeChanged$ = combineLatest([this.onContragent$, this.onConfigLoad$]).pipe(
        switchMap(() => this.orderService.getValidationTreeByContragent(this.currentContragentID$.value)),
    );

    onValidationStateByContragentChanged$ = this.onValidationTreeChanged$.pipe(
        map(tree => tree?.isInvalid ?? true));

    onValidationTabsChanged$ = this.onValidationTreeChanged$.pipe(map(tree => tree?._tabs ?? []));
    onValidationFloorsChanged$ = this.onValidationTreeChanged$.pipe(map(tree => tree?._floors ?? []));

    onProvidersReady$ = this.onConfigLoad$.pipe(tap(() => this.providerLayerFactory()));
    onBusesReady$ = this.onProvidersReady$.pipe(tap(() => this.busLayerFactory()));
    onConsumersReady$ = this.onBusesReady$.pipe(tap(() => this.consumerLayerFactory()));
    onViewReady$ = this.onConsumersReady$.pipe(tap(() => this.viewLayerFactory()));

    onTabsReady$: Observable<TabRxInput[]> = this.onViewReady$.pipe(
            tap(() => {
                this.tabsStore = {};
                this.selectionStore = {};
                this.viewsStore = {};
            }),
            tap(() => this.tabLayerFactory()),
            map(() => Object.values(this.tabsStore)),
        );

    onViewChanged$: Observable<TabConfig> = this._currentTab$.pipe(
        filter(key => !!this.viewsStore[key]),
        map(key => this.viewsStore[key]),
        shareReplay(1),
    );

    onSelectionByUser$: Observable<null> = this._selection$.pipe(
        tap((selection) => {
            // store
            const hash = hasher({entId: selection.entId, entKey: selection.entKey});
            const targetSelection = this.selectionStore[hash];
            const operation = targetSelection ? 'remove' : 'add';
            if (operation === 'add') {
                selection.contragent_entity_id = this.currentContragentID$.value;
            }
            operation === 'remove'
                ? targetSelection._status = 'selected'
                : this.selectionStore[hash] = selection;

            operation === 'add'
                ? this.orderService.addIntoCart(selection)
                : this.orderService.removeOrderFromCart(selection);
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
            const hash = hasher({entId: order.slot_entity_id, entKey: order.slot_entity_key});
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
                    entId: order.slot_entity_id,
                    entKey: order.slot_entity_key,
                    _status: 'confirmed',
                    tabKey: order.tab_key,
                    floorKey: order.floor_key,
                    sectionKey: order.section_key,
                };
            }
        }
        // проверяем если товара нет в корзине но он почему то выбран
        Object.entries(this.selectionStore).forEach(([__hash, __selection]) => {
            if (__selection?._status === 'selected') {
                needRefresh = true;
                this.selectionStore[__hash] = null;
            }
        });
        if (needRefresh) {
            this._syncOrders$.next();
        }
    }

    getConsumerByID(key: string): Observable<SlotEntity[]> {
        return this.consumers[key].pipe(
            take(1),
            shareReplay(1),
        ) ?? NEVER;
    }

    tabLayerFactory(): void {
        this._config.tabs.forEach(tc => {
            debugger;
            const tabConsumersKeys = tc.floors.map(f => f.consumerKeys).reduce((keys, cur) => [...keys, ...cur], []);
            const consumers: Observable<SlotEntity[]>[] = tabConsumersKeys.map(k => this.consumers[k]);
            this.tabsStore[tc.key] = {
                key: tc.key,
                title: tc.title,
                inEnabled$: zip(...consumers).pipe(
                    map(data => data.reduce((keys, cur) => [...keys, ...cur], [])),
                    map(ents => !!ents.length),
                ),
                inCount$: zip(...consumers).pipe(
                    map(data => data.reduce((keys, cur) => [...keys, ...cur], [])),
                    map(ents => ents.length),
                ),
                isRequired: tc.required || tc.floors.some(f => f.required),
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
            this.providers[_.key] = this.currentContragentID$.pipe(
                switchMap(id => this.restService.getSlotsByContragent<SlotEntity>(
                    _.entityKey,
                    id,
                    _.restrictors ?? []
            )));
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
            );
        });
    }

    consumerLayerFactory(): void {
        const config = this._config;

        config.consumers.forEach(cfg => {
            const t_bus = this.buses[cfg.busKey];
            this.consumers[cfg.key] = t_bus.pipe(
                map(list =>
                    list.map(ent => ({...ent, _entity_key: cfg.entityKey} as SlotEntity))
                        .filter(ent => cfg.restrictors.length ? cfg.restrictors.every(r => ent._entity[r.key] === r.value) : true),
                ),
            );
        });

    }

    selectTab(tabKey: string): void {
        this._currentTab$.next(tabKey);
    }

    selectFirstTab(): void {
        this.onConfigLoad$.pipe(
            take(1),
            map(data => data.tabs?.[0]?.key),
            filter(data => !!data),
        ).subscribe((tab ) => {
            this.selectTab(tab);
        });
    }

    selectItem(
        entity: Entity,
        tabKey: string,
        floorKey: string,
        sectionKey: string,
    ): void {
        const data: SelectionOrderSlot = {
            _status: 'selected',
            entKey: entity._entity_key,
            entId: entity.id,
            tabKey,
            floorKey,
            sectionKey,
        };
        this._selection$.next(data);
    }

    clearAllSelections(): void {
        this.selectionStore = {};
    }

    deselectItemFromCart(selection: SelectionOrderSlot): void {
        this._selection$.next(selection);
    }

    getSelectedStateByEntity(entity: Entity): SelectedState {
        const hash = hasher({ entId: entity.id, entKey: entity._entity_key });
        const target = this.selectionStore[hash];
        return target?._status ?? 'unselected';
    }

    getValidationStateTabByKey(tabKey: string): Observable<ValidationTreeItem> {
        return this.onValidationTabsChanged$.pipe(map(tabs => tabs.find(t => t.key === tabKey)));
    }

    getValidationStateFloorByKey(floorKey: string): Observable<ValidationTreeItem> {
        return this.onValidationFloorsChanged$.pipe(map(floors => floors.find(f => f.key === floorKey)));
    }
}
