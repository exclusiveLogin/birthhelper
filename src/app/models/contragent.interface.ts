import {Entity} from 'app/models/entity.interface';

export interface Contragent extends Entity {
    address_id: number;
    active: boolean;
}
