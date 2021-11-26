import {Entity} from 'app/models/entity.interface';

export interface Contragent extends Entity {
    address_id: number;
    active: boolean;
    image_id: number;
    title: string;
    phone_container_id: number;
    description: string;
    license: null;
    meta: ExtraMetaContragent;
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
    address_id: {
        id: number,
        address_str: string,
        district: number,
        country: string,
        city: string,
        street: string,
        building: string,
        letera: string,
        block: string,
        position_lat: number,
        position_lon: number,
    };
}
