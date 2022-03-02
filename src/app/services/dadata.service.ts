import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '@environments/environment';

export interface IDadataPositionRequest {
    lat: number; // 	✓		Географическая широта
    lon: number; // 	✓		Географическая долгота
    radius_meters:	number; // 		100	Радиус поиска в метрах (максимум – 1000)
    count?:	number; // 		10	Количество результатов (максимум — 20)
    language?:	string; // 		ru	На каком языке вернуть результат (ru / en)
}

interface IDadataData {
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

interface IDadataSuggestion {
    value: string;
    unrestricted_value: string;
    data: IDadataData;
}

export interface IDadataPositionResponse {
    suggestions: IDadataSuggestion[];
}

export interface IDadataSearchResponse {
    source: string; // 	250	Исходный адрес одной строкой
    result: string; // 		500	Стандартизованный адрес одной строкой
    postal_code: string; // 		6	Индекс
    country: string; // 		120	Страна
    country_iso_code: string; // 		2	ISO-код страны
    federal_district: string; // 		20	Федеральный округ
    region_fias_id: string; // 		36	ФИАС-код региона
    region_kladr_id: string; // 		19	КЛАДР-код региона
    region_iso_code: string; // 		6	ISO-код региона
    region_with_type: string; // 		131	Регион с типом
    region_type: string; // 		10	Тип региона (сокращенный)
    region_type_full: string; // 		50	Тип региона
    region: string; // 		120	Регион
    area_fias_id: string; // 		36	ФИАС-код района
    area_kladr_id: string; // 		19	КЛАДР-код района
    area_with_type: string; // 		131	Район в регионе с типом
    area_type: string; // 		10	Тип района в регионе (сокращенный)
    area_type_full: string; // 		50	Тип района в регионе
    area: string; // 		120	Район в регионе
    city_fias_id: string; // 		36	ФИАС-код города
    city_kladr_id: string; // 		19	КЛАДР-код города
    city_with_type: string; // 		131	Город с типом
    city_type: string; // 		10	Тип города (сокращенный)
    city_type_full: string; // 		50	Тип города
    city: string; // 		120	Город
    city_area: string; // 		120	Административный округ (только для Москвы)
    city_district_fias_id: string; // 		36	ФИАС-код района города (заполняется, только если район есть в ФИАС)
    city_district_kladr_id: string; // 		19	КЛАДР-код района города (не заполняется)
    city_district_with_type: string; // 		131	Район города с типом
    city_district_type: string; // 		10	Тип района города (сокращенный)
    city_district_type_full: string; // 		50	Тип района города
    city_district: string; // 		120	Район города
    settlement_fias_id: string; // 		36	ФИАС-код населенного пункта
    settlement_kladr_id: string; // 		19	КЛАДР-код населенного пункта
    settlement_with_type: string; // 		131	Населенный пункт с типом
    settlement_type: string; // 		10	Тип населенного пункта (сокращенный)
    settlement_type_full: string; // 		50	Тип населенного пункта
    settlement: string; // 		120	Населенный пункт
    street_fias_id: string; // 		36	ФИАС-код улицы
    street_kladr_id: string; // 		19	КЛАДР-код улицы
    street_with_type: string; // 		131	Улица с типом
    street_type: string; // 		10	Тип улицы (сокращенный)
    street_type_full: string; // 		50	Тип улицы
    street: string; // 		120	Улица
    house_fias_id: string; // 		36	ФИАС-код дома
    house_kladr_id: string; // 		19	КЛАДР-код дома
    house_type: string; // 		10	Тип дома (сокращенный)
    house_type_full: string; // 		50	Тип дома
    house: string; // 		50	Дом
    block_type: string; // 		10	Тип корпуса/строения (сокращенный)
    block_type_full: string; // 		50	Тип корпуса/строения
    block: string; // 		50	Корпус/строение
    entrance: string; // 		10	Подъезд
    floor: string; // 		10	Этаж
    flat_fias_id: string; // 		36	ФИАС-код квартиры
    flat_type: string; // 		10	Тип квартиры (сокращенный)
    flat_type_full: string; // 		50	Тип квартиры
    flat: string; // 		50	Квартира
    flat_area: string; // 		50	Площадь квартиры
    square_meter_price: string; // 		50	Рыночная стоимость м²
    flat_price: string; // 		50	Рыночная стоимость квартиры
    postal_box: string; // 		50	Абонентский ящик
    fias_id: string; // 		36	ФИАС-код адреса (идентификатор ФИАС)
    fias_code: string; // 			Иерархический код адреса в ФИАС (СС+РРР+ГГГ+ППП+СССС+УУУУ+ДДДД)
    fias_level: string; // 		2	Уровень детализации, до которого адрес найден в ФИАС
    fias_actuality_state: string; // 			Признак актуальности адреса в ФИАС
    kladr_id: string; // 		19	КЛАДР-код адреса
    capital_marker: string; // 		1	Признак центра района или региона
    okato: string; // 		11	Код ОКАТО
    oktmo: string; // 		11	Код ОКТМО
    tax_office: string; // 		4	Код ИФНС для физических лиц
    tax_office_legal: string; // 		4	Код ИФНС для организаций
    timezone: string; // 		50	Часовой пояс города для России, часовой пояс страны — для иностранных адресов
    geo_lat: string; // 		12	Координаты: широта
    geo_lon: string; // 		12	Координаты: долгота
    beltway_hit: string; // 	8	Внутри кольцевой
    beltway_distance: string; // 		3	Расстояние от кольцевой в км
    qc_geo: string; // 		5	Код точности координат
    qc_complete: string; // 		5	Код пригодности к рассылке
    qc_house: string; // 		5	Признак наличия дома в ФИАС
    qc: string; // 		5	Код проверки адреса
    unparsed_parts: string; // 		250	Нераспознанная часть адреса.
    metro: any[]; // Список ближайших станций метро (до трёх штук)
}

@Injectable({
    providedIn: 'root'
})
export class DadataService {

    constructor(
        private http: HttpClient,
    ) {}

    public getDadataResponseByPosition(lat: number, lon: number, radius_meters = 10): Observable<IDadataPositionResponse> {
        const data: IDadataPositionRequest = {
            lat, lon, radius_meters
        };
        return this.http.post<IDadataPositionResponse>(
            'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address',
            data,
            {headers: this.createAuthDadataHeaders()});
    }

    public getDadataResponseBySearch(search: string): Observable<IDadataSearchResponse> {
        const data =  [search];
        return this.http.post<IDadataSearchResponse>(
            'https://cleaner.dadata.ru/api/v1/clean/address',
            data,
            {headers: this.createAuthDadataHeaders(true)});
    }

    createAuthDadataHeaders(needSecret?: boolean): HttpHeaders {
        const token = environment.dadataAuthorizationKey;
        const secretKey = environment.datataSecretKey;

        let headers = new HttpHeaders({Authorization: 'Token ' + token});
        if (needSecret) {
            headers = headers.append('X-Secret', secretKey);
        }

        return headers;
    }
}
