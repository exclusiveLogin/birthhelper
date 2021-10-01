import {MetaPhoto} from 'app/models/map-object.interface';
import {MetaInterface} from 'app/models/meta.interface';
import {SlotEntity} from 'app/models/entity.interface';
import {ServiceSlot} from 'app/models/slot';

export interface PersonSlot extends ServiceSlot, SlotEntity<DoctorSrc> {
    photo_url: string;
    first_name: string;
    last_name: string;
    category_lettera: string;
    category_title: string;
    experience_years: string;
    count_birth: string;
    description: string;
}

export interface DoctorSrc extends MetaInterface {
    id: number;
    full_name: string;
    short_name: string;
    patronymic: string;
    experience: string;
    count: string;
    image_id: number;
    description_education: string;
    category: number;
    description_experience: string;
    position: number;
    clinic_id: number;
    def: boolean;
}

export class Person {
    static serialize(src: PersonSlot): PersonSlot {
        // photo
        let ph: MetaPhoto = src?.meta?.image_id as MetaPhoto;
        ph = ph ?? src?._entity?.meta?.image_id as MetaPhoto;

        const position: string =  src?._entity?.meta?.position?.title ?? '';
        const cat: string =  src?._entity?.meta?.category?.title ?? '';
        const cat_lettera: string =  src?._entity?.meta?.category?.lettera ?? '';
        const count_birth = src?._entity?.count;
        const exp = src?._entity?.experience;

        return {
            ...src,
            photo_url: ph?.filename,
            category_lettera: cat_lettera,
            first_name: src?._entity?.full_name ?? 'Без имени',
            last_name: src?._entity?.short_name ?? '',
            description: `${position ? position + ', ' : ''}${cat ?? ''}`,
            experience_years: exp,
            count_birth,
            category_title: cat,
        };
    }
}
