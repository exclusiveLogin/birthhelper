import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "@environments/environment";

export interface IDadataPositionRequest {
    lat: number; // 	✓		Географическая широта
    lon: number; // 	✓		Географическая долгота
    radius_meters: number; // 		100	Радиус поиска в метрах (максимум – 1000)
    count?: number; // 		10	Количество результатов (максимум — 20)
    language?: string; // 		ru	На каком языке вернуть результат (ru / en)
}

export interface IDadataPositionData {
    country: string; // 	Страна
    country_iso_code: string; // 	ISO-код страны (двухсимвольный)
    federal_district: string; // 	Федеральный округ
    region_fias_id: string; // 	Код ФИАС региона
    region_kladr_id: string; // 	Код КЛАДР региона
    region_iso_code: string; // 	ISO-код региона
    region_with_type: string; // 	Регион с типом
    region_type: string; // 	Тип региона (сокращенный)
    region_type_full: string; // 	Тип региона
    region: string; // 	Регион
    area_fias_id: string; // 	Код ФИАС района в регионе
    area_kladr_id: string; // 	Код КЛАДР района в регионе
    area_with_type: string; // 	Район в регионе с типом
    area_type: string; // 	Тип района в регионе (сокращенный)
    area_type_full: string; // 	Тип района в регионе
    area: string; // 	Район в регионе
    city_fias_id: string; // 	Код ФИАС города
    city_kladr_id: string; // 	Код КЛАДР города
    city_with_type: string; // 	Город с типом
    city_type: string; // 	Тип города (сокращенный)
    city_type_full: string; // 	Тип города
    city: string; // 	Город
    city_district_fias_id: string; // 	Код ФИАС района города (заполняется, только если район есть в ФИАС)
    city_district_kladr_id: string; // 	не заполняется
    city_district_with_type: string; // 	Район города с типом
    city_district_type: string; // 	Тип района города (сокращенный)
    city_district_type_full: string; // 	Тип района города
    city_district: string; // 	Район города
    settlement_fias_id: string; // 	Код ФИАС нас. пункта
    settlement_kladr_id: string; // 	Код КЛАДР нас. пункта
    settlement_with_type: string; // 	Населенный пункт с типом
    settlement_type: string; // 	Тип населенного пункта (сокращенный)
    settlement_type_full: string; // 	Тип населенного пункта
    settlement: string; // 	Населенный пункт
    street_fias_id: string; // 	Код ФИАС улицы
    street_kladr_id: string; // 	Код КЛАДР улицы
    street_with_type: string; // 	Улица с типом
    street_type: string; // 	Тип улицы (сокращенный)
    street_type_full: string; // 	Тип улицы
    street: string; // 	Улица
    stead_fias_id: string; // 	Код ФИАС земельного участка
    stead_kladr_id: string; // 	Код КЛАДР земельного участка
    stead_cadnum: string; // 	не заполняется
    stead_type: string; // 	= «уч»
    stead_type_full: string; // 	= «участок»
    stead: string; // 	номер земельного участка
    house_fias_id: string; // 	Код ФИАС дома
    house_kladr_id: string; // 	Код КЛАДР дома
    house_cadnum: string; // 	не заполняется
    house_type: string; // 	Тип дома (сокращенный)
    house_type_full: string; // 	Тип дома
    house: string; // 	Дом
    block_type: string; // 	Тип корпуса/строения (сокращенный)
    block_type_full: string; // 	Тип корпуса/строения
    block: string; // 	Корпус/строение
    entrance: string; // 	не заполняется
    floor: string; // 	не заполняется
    flat_fias_id: string; // 	Код ФИАС квартиры
    flat_cadnum: string; // 	не заполняется
    flat_type: string; // 	Тип квартиры (сокращенный)
    flat_type_full: string; // 	Тип квартиры
    flat: string; // 	Квартира
    postal_box: string; // 	Абонентский ящик
    fias_id: string; // 	Код ФИАС для России
    fias_level: string; // ровень детализации, до которого адрес найден в ФИАС
    kladr_id: string; // 	Код КЛАДР
    geoname_id: string; // 	Идентификатор объекта в базе GeoNames. Для российских адресов не заполняется.
    capital_marker: string; // 	Признак центра района или региона:
    okato: string; // 	Код ОКАТО
    oktmo: string; // 	Код ОКТМО
    tax_office: string; // 	Код ИФНС для физических лиц
    tax_office_legal: string; // 	Код ИФНС для организаций
    history_values: string; // [ ]	Список исторических названий объекта нижнего уровня.
}

export interface IDadataSearchData {
    postal_code: string;
    country: string;
    country_iso_code: string;
    federal_district: string;
    region_fias_id: string;
    region_kladr_id: string;
    region_iso_code: string;
    region_with_type: string;
    region_type: string;
    region_type_full: string;
    region: string;
    area_fias_id: string;
    area_kladr_id: string;
    area_with_type: string;
    area_type: string;
    area_type_full: string;
    area: string;
    city_fias_id: string;
    city_kladr_id: string;
    city_with_type: string;
    city_type: string;
    city_type_full: string;
    city: string;
    city_area: string;
    city_district_fias_id: string;
    city_district_kladr_id: string;
    city_district_with_type: string;
    city_district_type: string;
    city_district_type_full: string;
    city_district: string;
    settlement_fias_id: string;
    settlement_kladr_id: string;
    settlement_with_type: string;
    settlement_type: string;
    settlement_type_full: string;
    settlement: string;
    street_fias_id: string;
    street_kladr_id: string;
    street_with_type: string;
    street_type: string;
    street_type_full: string;
    street: string;
    stead_fias_id: string;
    stead_cadnum: string;
    stead_type: string;
    stead_type_full: string;
    stead: string;
    house_fias_id: string;
    house_kladr_id: string;
    house_cadnum: string;
    house_type: string;
    house_type_full: string;
    house: string;
    block_type: string;
    block_type_full: string;
    block: string;
    entrance: string;
    floor: string;
    flat_fias_id: string;
    flat_cadnum: string;
    flat_type: string;
    flat_type_full: string;
    flat: string;
    flat_area: string;
    square_meter_price: string;
    flat_price: string;
    postal_box: string;
    fias_id: string;
    fias_code: string;
    fias_level: string;
    fias_actuality_state: string;
    kladr_id: string;
    geoname_id: string;
    capital_marker: string;
    okato: string;
    oktmo: string;
    tax_office: string;
    tax_office_legal: string;
    timezone: string;
    geo_lat: string;
    geo_lon: string;
    beltway_hit: string;
    beltway_distance: string;
    metro: string;
    qc_geo: string;
    qc_complete: string;
    qc_house: string;
    history_values: string[];
    unparsed_parts: any;
    source: string;
    qc: number;
}

export interface IDadataSuggestion<T> {
    value: string;
    unrestricted_value: string;
    data: T;
}

export interface IDadataResponse<T> {
    suggestions: IDadataSuggestion<T>[];
}

@Injectable({
    providedIn: "root",
})
export class DadataService {
    constructor(private http: HttpClient) {}

    public getDadataResponseByPosition(
        lat: number,
        lon: number,
        radius_meters = 10
    ): Observable<IDadataResponse<IDadataPositionData>> {
        const data: IDadataPositionRequest = {
            lat,
            lon,
            radius_meters,
        };
        return this.http.post<IDadataResponse<IDadataPositionData>>(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address",
            data,
            { headers: this.createAuthDadataHeaders() }
        );
    }

    public getDadataResponseBySearch(
        search: string
    ): Observable<IDadataResponse<IDadataSearchData>> {
        const data = { query: search };
        return this.http.post<IDadataResponse<IDadataSearchData>>(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
            data,
            { headers: this.createAuthDadataHeaders(true) }
        );
    }

    createAuthDadataHeaders(needSecret?: boolean): HttpHeaders {
        const token = environment.dadataAuthorizationKey;
        const secretKey = environment.datataSecretKey;

        let headers = new HttpHeaders({ Authorization: "Token " + token });
        if (needSecret) {
            headers = headers.append("X-Secret", secretKey);
        }

        return headers;
    }
}
