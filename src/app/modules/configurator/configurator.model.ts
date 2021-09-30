import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Entity} from 'app/models/entity.interface';

export type PriorityFloor = 'high' | 'mid' | 'low';

export interface Restrictor {
    key: string;
    value: number | string;
    mode?: 'positive' | 'negative';
}

export interface Provider {
    key: string;
    busKey: string;
    entityKey: string;
    restrictors: Restrictor[];
}

export interface Consumer {
    title: string;
    key: string;
    entityKey: string;
    busKey: string;
    restrictors?: Restrictor[];
    priority?: PriorityFloor;
}

export interface TabConfig {
    key: string;
    title: string;
    floors: TabFloorSetting[];
}

export interface TabFloorSetting {
    title: string;
    entityType?: 'person' | 'placement' | 'other';
    consumerKeys: string[];
}

export interface ConfiguratorConfigSrc {
    providers: Provider[];
    consumers: Consumer[];
    tabs: TabConfig[];
}

export interface TabRxInput {
    key: string;
    title: string;
    inEnabled$: Observable<boolean>;
    inCount$: Observable<number>;
    inSelected$: Observable<number>;
    selectedHashes: string[];
}

export interface DataStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: Observable<any>;
}

export interface SelectionStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: Entity;
}

export interface TabsStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: TabRxInput;
}

export interface ViewStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: TabConfig;
}
