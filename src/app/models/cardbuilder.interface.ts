import {MetaPhoto} from 'app/models/map-object.interface';
import {MetaInterface} from 'app/models/meta.interface';
import {SlotEntity} from 'app/models/entity.interface';
import {ServiceSlot} from 'app/models/slot';
import {ServiceEntity} from 'app/models/service.interface';

export interface CardSlot extends ServiceSlot, SlotEntity<MatanizedServiceSrc> {
    photo_url: string;
    title: string;
    description: string;
}

export interface MatanizedServiceSrc extends ServiceEntity, MetaInterface {}

export class ConfiguratorCardBuilder {
    static serialize(src: CardSlot): CardSlot {
        // photo
        let ph: MetaPhoto = src?.meta?.image_id as MetaPhoto;
        ph = ph ?? src?._entity?.meta?.image_id as MetaPhoto;

        const title: string = src?.title ?? src?._entity?.title;
        const description: string = src?.description ?? src?._entity?.description;

        return {
            ...src,
            photo_url: ph?.filename,
            title,
            description: description ?? 'Нет описания',
        };
    }
}