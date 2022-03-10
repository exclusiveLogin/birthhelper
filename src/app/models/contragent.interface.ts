import {Entity} from 'app/models/entity.interface';
import {SectionType} from '@services/search.service';

export interface Contragent extends Entity {
    active: boolean;
    image_id: number;
    title: string;
    phone_container_id: number;
    description: string;
    license: null;
    address_src: string;
    city: string;
    country: string;
    position_lat: number;
    position_lon: number;
    meta: ExtraMetaContragent;
    phones?: ContragentsPhone[];
}

export interface ExtraMetaContragent {
    [key: string]: any;
    image_id: {
        id: number,
        file_id: number,
        title: string,
        description: string,
        datetime_update: string,
        datetime_create: string,
        filename: string,
    };
}

export interface ContragentsPhone {
    id: number;
    container_id: number;
    phone_id: number;
    comment: string;
    eid: number;
    phone: string;
    title: string;
    description: string;
    section: SectionType;
}
