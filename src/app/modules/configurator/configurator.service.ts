import {Injectable} from '@angular/core';
import {SectionType} from 'app/services/data-provider.service';
import {
    BehaviorSubject,
    Observable,
    Subject,
    combineLatest, merge
} from 'rxjs';
import {
    ConfiguratorConfigSrc,
    ConfiguratorView,
    DataStore,
    SelectionStore,
    TabsStore,
    ViewStore
} from 'app/modules/configurator/configurator.model';

import {RestService} from 'app/services/rest.service';
import {Entity} from 'app/models/entity.interface';
import {filter, map, reduce, switchMap, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfiguratorService {

    constructor(
        private rest: RestService,
    ) {
        this.onConsumersReady.subscribe(d => {});
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
    private _selection$ = new BehaviorSubject<SelectionStore>(this.selectionStore);

    onContragent$ = combineLatest([this.currentContragentID$, this.currentContragentEntityKey$]).pipe(
        filter(([id, key]) => !!id && !!key),
        switchMap(([id, key]) => this.rest.getEntity(key, id)));

    onConfigLoad$: Observable<ConfiguratorConfigSrc> =
        combineLatest([this.currentContragentID$, this.currentContragentEntityKey$, this.currentSectionKey$]).pipe(
            filter(([id, entKey, section]) => !!id && !!entKey && !!section),
            switchMap(([id, entKey, section]) => this.rest.getConfiguratorSettings(section)),
            tap(config => this._config = config),
        );

    onProvidersReady = this.onConfigLoad$.pipe(tap(() => this.providerLayerFactory()));
    onBusesReady = this.onProvidersReady.pipe(tap(() => this.busLayerFactory()));
    onConsumersReady = this.onBusesReady.pipe(tap(() => this.consumerLayerFactory()));

    onSelection$: Observable<SelectionStore> = this._selection$.pipe();

    viewLayerFactory(config: ConfiguratorConfigSrc): void {
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
        // console.log('dataLayerFactory providerConfigs', providerConfigs, this.providers);
        merge(...Object.values(this.providers)).subscribe(d => console.log('dataLayerFactory init providers', d));
    }

    busLayerFactory(): void {
        const config = this._config;
        const uniqBusKeys = config.providers
            .map((providerConfig) => providerConfig.busKey)
            .filter((value, index, _arr) => _arr.indexOf(value) === index);

        // console.log('busLayerFactory uniqBusKeys', uniqBusKeys);
        uniqBusKeys.forEach(key => {
            const t_configs = config.providers.filter(c => c.busKey === key);
            const t_providers = t_configs.map(cfg => this.providers[cfg.key]);
            this.buses[key] = combineLatest(...[t_providers]).pipe(map(data => data.reduce((e, acc) => ([...acc, e]), [])));
        });
        merge(...Object.values(this.providers)).subscribe(d => console.log('busLayerFactory init providers', d));
    }

    consumerLayerFactory(): void {
        const config = this._config;
        // const uniqBusKeys = providerConfigs
        //     .map((providerConfig) => providerConfig.busKey)
        //     .filter((value, index, _arr) => _arr.indexOf(value) === index);

        // const busFetchers$ = uniqBusKeys.map(key =>);
    }

    selectTab(tabKey: string): void {
        this._currentTab$.next(tabKey);
    }

    selectItem(tabKey: string, floorKey: string, entity: Entity): void {
        const k = `${tabKey}_${floorKey}_${entity.id}`;
        if (this.selectionStore[k]) {
            delete this.selectionStore[k];
        } else {
            this.selectionStore[k] = entity;
        }

        this._selection$.next(this.selectionStore);
    }
}
