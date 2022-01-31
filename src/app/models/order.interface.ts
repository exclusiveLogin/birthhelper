import {hasher} from '../modules/utils/hasher';
import {PriceEntitySlot, SlotEntity} from './entity.interface';
import {SelectionOrderSlot, TabFloorSetting} from '../modules/configurator/configurator.model';
import {SectionType} from '../services/search.service';
import {MetaPhoto} from 'app/models/map-object.interface';
import {User} from './user.interface';

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
    contragent_entity_key?: string;
    contragent_entity_id?: number;
    group_token: string;
    datetime_update: string;
    datetime_create: string;
}

export interface OrderRequest {
    action: ODRER_ACTIONS;
    ent_key?: string;
    ent_id?: number;
    tab_key?: string;
    floor_key?: string;
    section_key?: string;
    contragent_entity_key?: string;
    contragent_entity_id?: number;
    contacts?: OrderContacts;
    id?: number;
    status?: StatusType;
    groupMode?: OrderGroupMode;
}

export interface OrderResponse {
    context: 'orders';
    result: OrderSrc[];
}

export interface OrderGroup {
    group_id: string;
    groupMode: OrderGroupMode;
    user: User;
    contacts: OrderContacts;
    orders: Order[];
}

export interface IOrder extends OrderSrc {
    raw: OrderSrc;
    hash: string;
    slot: PriceEntitySlot;
}

export interface OrderContacts {
    phone: string;
    email: string;
    skype: string;
    ch_email: boolean;
    ch_phone: boolean;
    ch_skype: boolean;
    ch_viber: boolean;
    ch_telegram: boolean;
    ch_whatsapp: boolean;
}

export enum ODRER_ACTIONS {
    GET = 'GET',
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    CLEAR = 'CLEAR',
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
    inwork = 'inwork',
    incomplete = 'incomplete',
    inplan = 'inplan',
}
export type StatusTypeMap = {
    [key in StatusType]: string;
};

export const StatusRusMap: StatusTypeMap = {
    pending: 'Выбран',
    waiting: 'Ожидает',
    canceled: 'Отменен',
    completed: 'Завершен',
    deleted: 'Удален',
    rejected: 'Отклонен',
    resolved: 'Одобрен',
    incomplete: 'Завершенные',
    inplan: 'Планируемые',
    inwork: 'В работе',
};

export type OrderGroupMode = 'order' | 'session';

export type StatusType = keyof typeof ORDER_STATUSES;

export type SlotEntityUtility = 'person' | 'placement' | 'other';

export class Order implements IOrder {
    id: number;
    user_id: number;
    session_id: number;
    slot_entity_key: string;
    slot_entity_id: number;
    tab_key: string;
    floor_key: string;
    section_key: SectionType;
    refferer: number;
    status: StatusType;
    group_token: string;
    datetime_update: string;
    datetime_create: string;
    raw: OrderSrc;
    hash: string;
    slot: PriceEntitySlot;
    utility: SlotEntityUtility = 'other';
    cartTitle: string;
    cartTitleAccent: string;
    cartPhoto: MetaPhoto;
    contragent_entity_key: string;
    contragent_entity_id: number;
    _status: 'pending' | 'error' | 'refreshing' | 'loading' | 'stable' = 'pending';

    constructor(src: OrderSrc) {
        this.raw = src;
        if (typeof src === 'object' && !!src.id && src.slot_entity_id && src.slot_entity_key) {
            Object.keys(src).forEach(k => this[k] = src[k]);
        }
        this.hash = hasher(src);
        this._status = 'loading';
        this.cartTitle = `[${this.id}] - #${this.hash}`;
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

    setSlot(slot: PriceEntitySlot): void {
        this.slot = slot;
        this.refreshCartRenderData();
    }

    setUtility(value: SlotEntityUtility): void {
        this.utility = value;
        this.refreshCartRenderData();
    }

    private refreshCartRenderData(): void {
        let ph: MetaPhoto = this.slot?.meta?.image_id as MetaPhoto;
        ph = ph ?? this.slot?._entity?.meta?.image_id as MetaPhoto;
        this.cartPhoto = ph;

        if (this.utility === 'person') {
            this.cartTitle = this.slot?._entity?.full_name
                ? `${this.slot?._entity?.full_name ?? ''} ${this.slot?._entity?.short_name ?? ''}` : 'Без имени';

            const position: string =  this.slot?._entity?.meta?.position?.title ?? '';
            const cat: string =  this.slot?._entity?.meta?.category?.title ?? '';
            this.cartTitleAccent = `${position ? position + ', ' : ''}${cat ?? ''}`;
        }

        if (this.utility === 'placement') {
            this.cartTitle = this.slot?.title ?? this.slot?._entity?.title;
        }

        if (this.utility === 'other') {
            this.cartTitle = this.slot?.title ?? this.slot?._entity?.title;
        }
    }
}

export function orderRestMapper(selection: SelectionOrderSlot, action: ODRER_ACTIONS): OrderRequest {
    return selection
        ? {
            ent_key: selection.entKey,
            ent_id: selection.entId,
            tab_key: selection.tabKey,
            floor_key: selection.floorKey,
            section_key: selection.sectionKey,
            contragent_entity_key: selection.contragent_entity_key,
            contragent_entity_id: selection.contragent_entity_id,
            action,
            id: selection.id,
            contacts: selection.contacts,
        }
        : {
            action
        };
}
