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
export interface SlotEntity<T = Entity, K = Contragent> extends Entity {
    _contragent?: K;
    _entity?: T;
}
