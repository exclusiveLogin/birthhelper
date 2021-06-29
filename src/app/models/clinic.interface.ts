import {MapObject} from 'src/app/models/map-object.interface';
import {MetaInterface} from 'src/app/models/meta.interface';

export interface IClinicMini extends MapObject {
    id: number;
    title: string;
    description: string;
    address: string;
    price_from: number;
    price_until: number;
    photo_url: string;
    stat_count: number;
    stat_value: number;
    features: ClinicFeatures;
}

export interface ClinicFeatures {
    license: string;
    status_iho: string;
    has_oms: string;
    has_dms: string;
    has_reanimation: string;
    has_consultation: string;
    stat_male: string;
    stat_female: string;
    foreign_service: string;
    mom_with_baby: string;
    free_meets: string;
}

export interface IClinicSrc extends MetaInterface {
    id: string;
    active: string;
    address_id: string;
    phone_container_id: string;
    title: string;
    description: string;
    license: string;
    status_iho: string;
    has_oms: string;
    has_dms: string;
    has_reanimation: string;
    has_consultation: string;
    stat_male: string;
    stat_female: string;
    foreign_service: string;
    mom_with_baby: string;
    free_meets: string;
    facilities_type: string;
    specialities_type: string;
}

