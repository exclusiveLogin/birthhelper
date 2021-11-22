import {hasher} from '../modules/utils/hasher';
import {PriceEntitySlot} from './entity.interface';
import {SelectionOrderSlot} from '../modules/configurator/configurator.model';

export interface OrderSrc {
    id: number;
    user_id: number;
    session_id: number;
    slot_entity_key: string;
    slot_entity_id: number;
    tab_key: string;
    floor_key: string;
    section_key: string;
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
    slot: PriceEntitySlot;
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
    tab_key: string;
    floor_key: string;
    section_key: string;
    refferer: number;
    status: StatusType;
    group_token: string;
    datetime_update: string;
    datetime_create: string;
    raw: OrderSrc;
    hash: string;
    slot: PriceEntitySlot;
    _status: 'pending' | 'error' | 'refreshing' | 'loading' | 'stable' = 'pending';

    constructor(src: OrderSrc) {
        this.raw = src;
        if (typeof src === 'object' && !!src.id && src.slot_entity_id && src.slot_entity_key) {
            Object.keys(src).forEach(k => this[k] = src[k]);
        }
        this.hash = hasher(src);
        this._status = 'loading';
    }

    update(src: OrderSrc): void {
        const hash = hasher(src);
        if (!!src && src.id !== this.id) {
            return;
        }

        this._status = 'stable';

        if (this.hash === hash) {
            return;
        }

        if (
            src.slot_entity_key !== this.slot_entity_key ||
            src.slot_entity_id !== this.slot_entity_id
        ) {
            this._status = 'loading';
        }
        Object.keys(src).forEach(k => this[k] = src[k]);
    }

}

export interface OrderRequest {
    ent_key: string;
    ent_id: number;
    tab_key: string;
    floor_key: string;
    section_key: string;
    action: ODRER_ACTIONS;
}
export function orderRestMapper(selection: SelectionOrderSlot, action: ODRER_ACTIONS): OrderRequest {
    return {
        ent_key: selection.entKey,
        ent_id: selection.entId,
        tab_key: selection.tabKey,
        floor_key: selection.floorKey,
        section_key: selection.sectionKey,
        action,
    };
}
