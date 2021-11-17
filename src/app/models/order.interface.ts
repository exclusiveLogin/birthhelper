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
    status: StatusType;
    group_token: string;
    datetime_update: string;
    datetime_create: string;
}

export interface OrderResponse {
    context: 'orders';
    result: OrderSrc[];
}
export interface IOrder extends OrderSrc {
    raw: OrderSrc;
    hash: string;
}

export enum ODRER_ACTIONS {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    SUBMIT = 'SUBMIT',
    RESOLVE = 'RESOLVE',
    REJECT = 'REJECT',
    CANCEL = 'CANCEL',
    COMPLETE = 'COMPLETE',
    SENDBYORG = 'SENDBYORG',

}

export enum ORDER_STATUSES {
    pending = 'pending',
    deleted = 'deleted',
    waiting = 'waiting',
    resolved = 'resolved',
    rejected = 'rejected',
    completed = 'completed',
    canceled = 'canceled',
    inprogress = 'inprogress',
}

export type StatusType = keyof typeof ORDER_STATUSES;

export class Order implements IOrder {
    id: number;
    user_id: number;
    session_id: number;
    slot_entity_key: string;
    slot_entity_id: number;
    refferer: number;
    status: StatusType;
    group_token: string;
    datetime_update: string;
    datetime_create: string;
    raw: OrderSrc;
    hash: string;
    slot: SlotEntity;
    doSlotUpdate$ = new Subject<null>();
    _status: 'pending' | 'updated' | 'error' | 'refreshing' = 'pending';

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
