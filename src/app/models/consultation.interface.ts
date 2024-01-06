import { MapObject, MetaPhoto } from "app/models/map-object.interface";
import { Summarized } from "./summary.interface";
import { Contragent } from "@models/contragent.interface";
import { Entity } from "@models/entity.interface";

export interface IConsultationMini extends MapObject, Entity {
    address: string;
    price_from: number;
    price_until: number;
    photo: MetaPhoto;
    stat_count: number;
    stat_value: number;
    features: ConsultationFeatures;
    pathology: ConsultationPathology;
}

export interface ConsultationFeatures {
    multi_birth: boolean;
    eco: boolean;
    home_visit: boolean;
}

export interface ConsultationPathology {
    avo: boolean;
    anemy: boolean;
    anomaly_evolution: boolean;
    gestos: boolean;
    hypoxy: boolean;
    mioms: boolean;
    onko: boolean;
}

export interface IConsultationSrc
    extends Contragent,
        Summarized,
        ConsultationPathology,
        ConsultationFeatures {
    contragent: number;
    foreign_service: string;
}

export class Consultation {
    static createConsultationMini(src: IConsultationSrc): IConsultationMini {
        const features: ConsultationFeatures = {
            eco: !!src.eco,
            home_visit: !!src.home_visit,
            multi_birth: !!src.multi_birth,
        };

        const pathology: ConsultationPathology = {
            anemy: !!src.anemy,
            anomaly_evolution: !!src.anomaly_evolution,
            avo: !!src.avo,
            gestos: !!src.gestos,
            hypoxy: !!src.hypoxy,
            mioms: !!src.mioms,
            onko: !!src.onko,
        };

        const ph: MetaPhoto = src?.meta?.image_id as MetaPhoto;

        return {
            id: src.id ? Number(src.id) : -1,
            address: src?.address_str || "Адрес не найден",
            description: src.description,
            title: src.title,
            price_from: src?.summary?.min_price,
            price_until: src?.summary?.max_price,
            photo: ph,
            stat_count: 0,
            stat_value: 0,
            features,
            pathology,
            lat: src?.position_lat || null,
            lon: src?.position_lon || null,
        } as IConsultationMini;
    }
}
