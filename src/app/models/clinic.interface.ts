import {AddressSrc, MapObject, MetaPhoto} from 'app/models/map-object.interface';
import {MetaInterface} from 'app/models/meta.interface';

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
    status_iho: boolean;
    has_oms: boolean;
    has_dms: boolean;
    has_reanimation: boolean;
    has_consultation: boolean;
    stat_male: number;
    stat_female: number;
    foreign_service: string;
    mom_with_baby: boolean;
    free_meets: boolean;
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

export class Clinic {
    static createClinicMini(src: IClinicSrc): IClinicMini {
        const features: ClinicFeatures = {
            foreign_service: src.foreign_service,
            free_meets: !!src.free_meets,
            has_dms: !!src.has_dms,
            has_oms: !!src.has_oms,
            has_consultation: !!src.has_consultation,
            has_reanimation: !!src.has_reanimation,
            license: src.license,
            mom_with_baby: !!src.mom_with_baby,
            stat_female: src.stat_female ? Number(src.stat_female) : 0,
            stat_male: src.stat_male ? Number(src.stat_male) : 0,
            status_iho: !!src.status_iho || false,
        };

        const addr: AddressSrc = src?.meta?.address_id?.[0] as AddressSrc;
        const ph: MetaPhoto = src?.meta?.image_id?.[0] as MetaPhoto;

        const clinic: IClinicMini = {
            id: src.id ? Number(src.id) : -1,
            address: addr?.address_str || 'Адрес не найден',
            description: src.description,
            title: src.title,
            price_from: null,
            price_until: null,
            photo_url: ph?.filename,
            stat_count: 0,
            stat_value: 0,
            features,
            lat: addr?.position_lat || null,
            lon: addr?.position_lon || null,
        };

        return clinic;
    }
}
