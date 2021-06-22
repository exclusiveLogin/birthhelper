import {IClinicMini} from 'src/app/models/clinic.interface';

type MapObjectEntity = IClinicMini;

export interface MapObject {
    lat: number;
    lon: number;
    description?: string;
    entity?: MapObjectEntity;
    iconClass?: string;
    color?: string;
    clickHandler?: Function;
    hoverHandler?: Function;
}

export interface AddressSrc {
    id: number;
    address_str: string;
    district: number;
    country: string;
    city: string;
    street: string;
    building: string;
    letera: string;
    block: string;
    position_lat: number;
    position_lon: number;
}
