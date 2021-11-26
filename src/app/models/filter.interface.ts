import {FormControl} from '@angular/forms';

export interface SearchSection {
    key: string;
    title: string;
    type: SearchFilterType;
    filters: SearchFilter[];
    control?: FormControl;
    preInitValue?: number;
}

export interface SearchFilterConfig {
    [key: string]: { [filter: string]: boolean | number | string };
}

export interface SearchFilter {
    id: number;
    title: string;
    control?: FormControl;
    preInitValue?: boolean;
}

export type SearchFilterType = 'flag' | 'select';
