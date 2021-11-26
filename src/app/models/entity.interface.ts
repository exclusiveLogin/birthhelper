import {Summary} from 'app/models/summary.interface';
import {Contragent} from 'app/models/contragent.interface';
import {MetaInterface} from 'app/models/meta.interface';

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
    _contragent?: K;
    _entity?: T;
    _contragent_entity_key: string;
    _entity_key: string;
    _contragent_id_key: string;
    _entity_id_key: string;
}

export type PriceEntitySlot = SlotEntity & Price & Benefits;
