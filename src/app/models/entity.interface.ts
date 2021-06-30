export interface Entity {
    id: number;
    title: string;
    description: string;
    datetime_create: string;
    datetime_update: string;
    [key: string]: any;
}
