import {Injectable} from '@angular/core';
import {SectionType} from 'app/services/data-provider.service';
import {
    BehaviorSubject,
    Observable, of,
    Subject
} from 'rxjs';
import {
    ConfiguratorConfigSrc,
    ConfiguratorView, DataStore,
    SelectionStore, TabsStore,
    ViewStore
} from 'app/modules/configurator/configurator.model';
import {RestService} from 'app/services/rest.service';
import {Entity} from 'app/models/entity.interface';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfiguratorService {

    constructor(
        private rest: RestService,
    ) {
    }

    private currentContragentID: number;
    private providers: DataStore = {};
    private buses: DataStore = {};
    private consumers: DataStore = {};

    private tabsStore: TabsStore = {};
    private selectionStore: SelectionStore = {};
    private viewsStore: ViewStore = {};

    private _config$ = new Subject<ConfiguratorConfigSrc>();
    private _currentTab$ = new Subject<string>();
    private _selection$ = new BehaviorSubject<SelectionStore>(this.selectionStore);

    onConfigLoad$: Observable<ConfiguratorConfigSrc> = this._config$.pipe();
    onView$: Observable<ConfiguratorView> = this._currentTab$.pipe(
        map(tabKey =>
            this.viewsStore[tabKey] ?
                this.viewsStore[tabKey] :
                null));
    onSelection$: Observable<SelectionStore> = this._selection$.pipe();

    setContragentID(id: number): void {
        this.currentContragentID = id;
    }

    loadConfig(sectionKey: SectionType): void {
        this.rest.getConfiguratorSettings(sectionKey).subscribe(d => {
            this._config$.next(d);
        });
    }

    viewLayerFactory(config: ConfiguratorConfigSrc): void {
    }

    dataLayerFactory(config: ConfiguratorConfigSrc): void {
        const providerConfigs = config?.providers ?? [];
        const providers$ = providerConfigs
            .map(_ => this.rest.getSlotsByContragent<Entity>(_.entityKey, this.currentContragentID, _.restrictors ?? []));

        const uniqBusKeys = providerConfigs
            .map((providerConfig) => providerConfig.busKey)
            .filter((value, index, _arr) => _arr.indexOf(value) === index);

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
