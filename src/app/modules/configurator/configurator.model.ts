import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Entity, SlotEntity} from 'app/models/entity.interface';

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

export type SelectMode = 'multi' | 'single';

export interface TabConfig {
    key: string;
    title: string;
    invalid: boolean;
    floors: TabFloorSetting[];
    selectMode?: SelectMode;
}

export interface TabFloorSetting {
    title: string;
    consumerKeys: string[];
    invalid: boolean;
    entityType?: 'person' | 'placement' | 'other';
    required?: boolean;
    selectMode?: SelectMode;
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
    // inSelected$: Observable<number>;
    // selectedHashes: string[];
}

export interface DataStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: Observable<SlotEntity[]>;
}
export type SelectedState = 'selected' | 'confirmed' | 'unselected';
export type SelectionOrderSlot = Entity & { _status: SelectedState};

export interface SelectionStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: SelectionOrderSlot;
}

export interface TabsStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: TabRxInput;
}

export interface ViewStore {
    // sectionKey_tabKey_floorKey_entId: Entity
    [key: string]: TabConfig;
}
