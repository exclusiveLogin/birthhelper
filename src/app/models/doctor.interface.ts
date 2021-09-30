import {MetaPhoto} from 'app/models/map-object.interface';
import {MetaInterface} from 'app/models/meta.interface';
import {SlotEntity} from 'app/models/entity.interface';
import {ServiceSlot} from 'app/models/slot';

export interface DoctorSlot extends ServiceSlot, SlotEntity<DoctorSrc> {
    photo_url: string;
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

export class Doctor {
    static serializeDoctorSlot(src: DoctorSlot): DoctorSlot {
        const ph: MetaPhoto = src?.meta?.image_id as MetaPhoto;

        return {
            ...src,
            photo_url: ph?.filename,
        };
    }
}
