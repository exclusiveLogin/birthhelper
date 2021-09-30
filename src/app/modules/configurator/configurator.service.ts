import {Injectable} from '@angular/core';
import {SectionType} from 'app/services/data-provider.service';
import {
    BehaviorSubject,
    Observable,
    Subject,
    combineLatest,
    zip, never, NEVER
} from 'rxjs';
import {
    ConfiguratorConfigSrc,
    DataStore,
    SelectionStore,
    TabConfig, TabRxInput,
    TabsStore,
    ViewStore
} from 'app/modules/configurator/configurator.model';
import md5 from 'md5';

import {RestService} from 'app/services/rest.service';
import {Entity} from 'app/models/entity.interface';
import {filter, map, shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfiguratorService {

    constructor(
        private rest: RestService,
    ) {
    }

    private _config: ConfiguratorConfigSrc;

    currentContragentID$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    currentContragentEntityKey$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    currentSectionKey$: BehaviorSubject<SectionType> = new BehaviorSubject<SectionType>(null);

    private providers: DataStore = {};
    private buses: DataStore = {};
    private consumers: DataStore = {};

    private tabsStore: TabsStore = {};
    private selectionStore: SelectionStore = {};
    private viewsStore: ViewStore = {};

    private _currentTab$ = new Subject<string>();
    private _selection$ = new Subject<[e: Entity, tab: string]>();

    onContragent$ = combineLatest([this.currentContragentID$, this.currentContragentEntityKey$]).pipe(
        filter(([id, key]) => !!id && !!key),
        switchMap(([id, key]) => this.rest.getEntity(key, id)),
        tap(d => console.log('onContragent$', d)),
    );

    onConfigLoad$: Observable<ConfiguratorConfigSrc> =
        combineLatest([this.currentContragentID$, this.currentContragentEntityKey$, this.currentSectionKey$]).pipe(
            filter(([id, entKey, section]) => !!id && !!entKey && !!section),
            switchMap(([id, entKey, section]) => this.rest.getConfiguratorSettings(section)),
            tap(config => this._config = config),
        );

    onProvidersReady$ = this.onConfigLoad$.pipe(tap(() => this.providerLayerFactory()));
    onBusesReady$ = this.onProvidersReady$.pipe(tap(() => this.busLayerFactory()));
    onConsumersReady$ = this.onBusesReady$.pipe(tap(() => this.consumerLayerFactory()));
    onViewReady$ = this.onConsumersReady$.pipe(tap(() => this.viewLayerFactory()));
    onTabsReady$: Observable<TabRxInput[]> =
        this.onViewReady$.pipe(tap(() => this.tabLayerFactory()), map(() => Object.values(this.tabsStore)));

    onViewChanged$: Observable<TabConfig> = this._currentTab$.pipe(
        filter(key => !!this.viewsStore[key]),
        map(key => this.viewsStore[key]));

    onSelection$: Observable<SelectionStore> = this._selection$.pipe(
        tap(([item, tab]) => {
            const hash = this.hasher(item);
            this.selectionStore[hash] = this.selectionStore[hash] ? null : item;

            const idxOfHash = this.tabsStore[tab].selectedHashes.indexOf(hash);
            if (idxOfHash >= 0) {
                // if exist hash in tab
                delete this.tabsStore[tab].selectedHashes[idxOfHash];
            } else {
                this.tabsStore[tab].selectedHashes.push(hash);
            }
        }),
        tap(() => Object.keys(this.selectionStore)
            .filter(k => !this.selectionStore[k])
            .forEach(k => delete this.selectionStore[k])),
        map(() => this.selectionStore),
    );

    getConsumerByID(key: string): Observable<Entity[]> {
        return this.consumers[key] ?? NEVER;
    }

    hasher(item: any): string {
        return md5(JSON.stringify(item));
    }

    tabLayerFactory(): void {
        this._config.tabs.forEach(tc => {
            const tabConsumersKeys = tc.floors.map(f => f.consumerKeys).reduce((keys, cur) => [...keys, ...cur], []);
            const consumers: Observable<Entity[]>[] = tabConsumersKeys.map(k => this.consumers[k]);

            console.log('tabLayerFactory ', tabConsumersKeys);
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
                inSelected$: this.onSelection$.pipe(map(() => this.tabsStore[tc.key].selectedHashes.length)),
                selectedHashes: [],
            };
        });
        console.log('tabLayerFactory after ', this.tabsStore);
    }

    viewLayerFactory(): void {
        this._config.tabs.forEach(tcfg => this.viewsStore[tcfg.key] = tcfg);
    }

    providerLayerFactory(): void {
        const config = this._config;
        const providerConfigs = config?.providers ?? [];
        providerConfigs.forEach(_ => {
            this.providers[_.key] = this.rest.getSlotsByContragent<Entity>(
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
                map(list => list.map(ent => ({...ent, _entity_key: cfg.entityKey}))),
                tap((data) => console.log('consumers fire: ', data)),
            );
        });

    }

    selectTab(tabKey: string): void {
        this._currentTab$.next(tabKey);
    }

    selectItem(entity: Entity, tabKey: string): void {
        this._selection$.next([entity, tabKey]);
    }
}
