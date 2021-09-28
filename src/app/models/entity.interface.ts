import {Summary} from 'app/models/summary.interface';

export interface Entity extends Slotted {
    [key: string]: any;
    id: number;
    datetime_create?: string;
    datetime_update?: string;
    summary?: Summary;
}

export interface Slotted {
    _contragent?: Entity;
    _entity?: Entity;
}
