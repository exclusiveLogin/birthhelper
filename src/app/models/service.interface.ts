import {Entity} from 'app/models/entity.interface';

export interface ServiceEntity extends Entity {
    id: number;
    title: string;
    description: string;
    image_id: number;
    trimester: string;
    article_id: number;
    adv: boolean;
    slot_category_type: number;
}
