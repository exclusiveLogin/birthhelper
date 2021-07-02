export interface Entity {
    id: number;
    datetime_create?: string;
    datetime_update?: string;
    [key: string]: any;
}
