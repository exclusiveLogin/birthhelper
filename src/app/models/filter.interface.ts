import {FormControl} from '@angular/forms';

export interface SearchSection {
    key: string;
    title: string;
    type: SearchFilterType;
    filters: SearchFilter[];
    control?: FormControl;
}

export interface SearchFilter {
    id: number;
    title: string;
    control?: FormControl;
}

export type SearchFilterType = 'flag' | 'select';
