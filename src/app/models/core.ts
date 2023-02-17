import { SectionType } from "app/services/search.service";
export type SectionTypeDict = {
    [key in SectionType]: string;
};
export const Sections: SectionTypeDict = {
    clinic: "Родовспоможение",
    consultation: "Ведение беременности",
};

export interface TitledList<T> {
    title: string;
    key: string;
    list: T[];
}

export type Sectioned<T> = {
    [section in SectionType]?: T;
};
