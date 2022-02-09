import {MetaPhoto} from 'app/models/map-object.interface';
import {MetaInterface} from 'app/models/meta.interface';
import {SlotEntity} from 'app/models/entity.interface';
import {ServiceSlot} from 'app/models/slot';
import {ServiceEntity} from 'app/models/service.interface';

export interface CardSlot extends ServiceSlot, SlotEntity<MatanizedServiceSrc> {
    photo: MetaPhoto;
    title: string;
    description: string;
    description_ext1: string;
    description_ext2: string;
}

export interface MatanizedServiceSrc extends ServiceEntity, MetaInterface {}

export class ConfiguratorCardBuilder {
    static serialize(src: CardSlot): CardSlot {
        // photo
        const ph: MetaPhoto = src?._entity?.meta?.image_id as MetaPhoto;

        const title: string = src?.title ?? src?._entity?.title;
        const description: string = src?.description ?? src?._entity?.description;

        return {
            ...src,
            photo: ph,
            title,
            description: description ?? 'Нет описания',
            description_ext1: src?._entity?.description_ext1 ?? '',
            description_ext2: src?._entity?.description_ext2 ?? '',
        };
    }
}
