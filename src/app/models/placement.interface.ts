import {MetaPhoto} from 'app/models/map-object.interface';
import {MetaInterface} from 'app/models/meta.interface';
import {SlotEntity} from 'app/models/entity.interface';
import {ServiceSlot} from 'app/models/slot';
import {ServiceEntity} from 'app/models/service.interface';

export interface PlacementSlot extends ServiceSlot, SlotEntity<PlacementSrc> {
    photo_url: string;
    title: string;
    area: string;
    description: string;
}

export interface PlacementSrc extends ServiceEntity, MetaInterface {
}

export class PlacementBuilder {
    static serialize(src: PlacementSlot): PlacementSlot {
        // photo
        let ph: MetaPhoto = src?.meta?.image_id as MetaPhoto;
        ph = ph ?? src?._entity?.meta?.image_id as MetaPhoto;

        const title: string = src?.title ?? src?._entity?.title;
        const description: string = src?.description ?? src?._entity?.description;
        const area: string = src?.area;

        return {
            ...src,
            photo_url: ph?.filename,
            title,
            description: description ?? 'Нет описания',
            area,
        };
    }
}
