
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

export interface Config {
    providers: Provider[];
    consumers: Consumer[];
    tabs: TabConfig[];
}
