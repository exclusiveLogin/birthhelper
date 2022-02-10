import {Observable} from 'rxjs';
import {SlotEntity} from 'app/models/entity.interface';
import {OrderContacts, SlotEntityUtility, StatusType} from '../../models/order.interface';

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
    required?: boolean;
    selectMode?: SelectMode;
    poorErrorMessage?: string;
    richErrorMessage?: string;
    lockMessage?: string;
    defaultMessage?: string;
}

export interface TabFloorSetting {
    key: string;
    title: string;
    consumerKeys: string[];
    invalid: boolean;
    entityType?: SlotEntityUtility;
    required?: boolean;
    selectMode?: SelectMode;
    poorErrorMessage?: string;
    richErrorMessage?: string;
    lockMessage?: string;
    defaultMessage?: string;
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

export interface SelectionOrderSlot {
    _status?: SelectedState;
    entKey?: string;
    entId?: number;
    tabKey?: string;
    floorKey?: string;
    sectionKey?: string;
    id?: number;
    contragent_entity_key?: string;
    contragent_entity_id?: number;
    contacts?: OrderContacts;
    status?: StatusType;
    group_token?: string;
}

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
