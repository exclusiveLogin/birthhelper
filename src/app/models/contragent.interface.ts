import { Entity } from "app/models/entity.interface";
import { SectionType } from "@services/search.service";
import { IImage } from "@modules/admin/Dashboard/Editor/components/image/image.component";

export interface Contragent extends Entity {
    active: boolean;
    image_id: number;
    title: string;
    phone_container_id: number;
    description: string;
    license: string;
    address_src: string;
    city: string;
    country: string;
    position_lat: number;
    position_lon: number;
    meta: ExtraMetaContragent;
    phones?: ContragentsPhone[];
    section_clinic: boolean;
    section_consultation: boolean;
    contragent?: number;
}

export interface ExtraMetaContragent {
    [key: string]: any;
    image_id: IImage;
}

export interface ContragentsPhone {
    id: number;
    container_id: number;
    phone_id: number;
    comment: string;
    eid: number;
    phone: string;
    title: string;
    description: string;
    section: SectionType;
}
