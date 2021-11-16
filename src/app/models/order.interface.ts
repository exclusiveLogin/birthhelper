import {hasher} from '../modules/utils/hasher';
import {SlotEntity} from './entity.interface';
import {Subject} from 'rxjs/Subject';

export interface OrderSrc {
    id: number;
    user_id: number;
    session_id: number;
    slot_entity_key: string;
    slot_entity_id: number;
    refferer: number;
    status: string;
    group_token: string;
    datetime_update: string;
    datetime_create: string;
}
export interface IOrder extends OrderSrc {
    raw: OrderSrc;
    hash: string;
}

export class Order implements IOrder {
    id: number;
    user_id: number;
    session_id: number;
    slot_entity_key: string;
    slot_entity_id: number;
    refferer: number;
    status: string;
    group_token: string;
    datetime_update: string;
    datetime_create: string;
    raw: OrderSrc;
    hash: string;
    slot: SlotEntity;
    doSlotUpdate$ = new Subject<null>();

    constructor(src: OrderSrc) {
        this.raw = src;
        if (typeof src === 'object' && !!src.id && src.slot_entity_id && src.slot_entity_key) {
            Object.keys(src).forEach(k => this[k] = src[k]);
        }
        this.hash = hasher(src);
    }

    update(src: OrderSrc): void {
        if (!!src && src.id !== this.id) {
            return;
        }

        if (
            src.slot_entity_key !== this.slot_entity_key ||
            src.slot_entity_id !== this.slot_entity_id
        ) {
            this.slot_entity_key = src.slot_entity_key;
            this.slot_entity_id = src.slot_entity_id;
            this.doSlotUpdate$.next();
        }
        Object.keys(src).forEach(k => this[k] = src[k]);
    }

}
