import {MetaPhoto} from 'app/models/map-object.interface';
import {MetaInterface} from 'app/models/meta.interface';
import {SlotEntity} from 'app/models/entity.interface';
import {ServiceSlot} from 'app/models/slot';
import {environment} from '@environments/environment';

export interface PersonDoctorSlot extends ServiceSlot, SlotEntity<DoctorSrc> {
    photo_url: string;
    full_name: string;
    first_name: string;
    last_name: string;
    category_lettera: string;
    category_title: string;
    experience_years: string;
    count_birth: string;
    description: string;
    description_education: string;
    description_pro: string;
    description_services: string;
    description_experience: string;
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
    description_experience: string;
    description_pro: string;
    description_services: string;
    category: number;
    position: number;
    clinic_id: number;
    def: boolean;
}

export class PersonBuilder {
    static serialize(src: PersonDoctorSlot): PersonDoctorSlot {
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
            photo_url: ph?.aws ?? `${environment.static}${ph?.folder ?? ''}/${ph?.filename || 'noimage'}`,
            category_lettera: cat_lettera,
            first_name: src?._entity?.full_name ?? 'Без имени',
            last_name: src?._entity?.short_name ?? '',
            full_name: src?._entity?.full_name
                ? `${src?._entity?.full_name ?? ''} ${src?._entity?.short_name ?? ''}` : 'Без имени',
            description: `${position ? position + ', ' : ''}${cat ?? ''}`,
            description_education: src?._entity?.description_education,
            description_experience: src?._entity?.description_experience,
            description_pro: src?._entity?.description_pro,
            description_services: src?._entity?.description_services,
            experience_years: exp,
            count_birth,
            category_title: cat,
        };
    }
}
