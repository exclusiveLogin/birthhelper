import { Summary } from "@models/summary.interface";
import { Contragent } from "@models/contragent.interface";
import { MetaInterface } from "@models/meta.interface";
import { SectionType } from "@services/search.service";
import { Sectioned, TitledList } from "@models/core";
import { ConfiguratorConfigSrc } from "@modules/configurator/configurator.model";
import { SlotEntityUtility } from "@models/order.interface";

export interface Entity extends Summarized, MetaInterface {
    [key: string]: any;

    id: number;
    datetime_create?: string;
    datetime_update?: string;
}

export interface Summarized {
    summary?: Summary;
}

export interface Price {
    price?: number;
}

export interface Benefits {
    benefit_price?: number;
    benefit_percent?: number;
}

export interface SlotEntity<T = Entity, K = Contragent> extends Entity {
    isContragent?: boolean;
    entityName: string;
    _contragent?: K;
    _entity?: T;
    _contragent_entity_key: string;
    _entity_key: string;
    _contragent_id_key: string;
    _entity_id_key: string;
    _section: SectionType;
}

export type UtilizedFloorOfSlotEntity = {
    utility: SlotEntityUtility;
} & TitledList<SlotEntity>;

export interface TabedSlots {
    key: string;
    title: string;
    floors: UtilizedFloorOfSlotEntity[];
}

export interface ContragentSlots {
    tabs: TabedSlots[];
}

export type Entitized = {
    _entity: Entity;
};

export type SectionedContragentSlots = Sectioned<ContragentSlots>;

export type PriceEntitySlot = SlotEntity & Price & Benefits;
