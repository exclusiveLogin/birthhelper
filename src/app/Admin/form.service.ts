import {Injectable} from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {MenuService} from './Dashboard/menu.service';
import {Observable} from "rxjs/Observable";
import {NeverObservable} from "rxjs/observable/NeverObservable";
import {of} from "rxjs/observable/of";
import {distinctUntilChanged, filter, map, pluck, tap} from "rxjs/operators";

export interface IFieldSetting {
    id: string;
    title: string;
    type?: string;
    useDict?: boolean;
    dctKey?: string;
    dctItems?: any[];
    loaded?: boolean;
    required?: boolean;
    initData?: any;
    dictSelected?: any;
    canBeNull?: boolean;
    control?: FormControl;
    mirrorControl?: FormControl;
    titleControl?: FormControl;
    descriptionControl?: FormControl;
    readonly?: boolean;
    hide?: boolean;
    proxyTo?: string;
    image?: { urlType: string, urlKey: string };
    refresher?: Function;
}

export interface ILinkFieldSetting {
    id: string;
    title: string;
    type?: string;
    loaded?: boolean;
    required?: boolean;
    initData?: any;
    withDebugField?: boolean;
    multiselect?: boolean;
    entKey?: string;
    dummyTitle?: string;
    entType?: string;
    proxyTo?: string;
    image?: { urlType: string, urlKey: string };
    conditionField: string;
    conditionKey: string;
    conditionValue: number | string;
    hide?: boolean;
    imageLoader?: boolean;
    imageControl?: FormControl;
    titleControl?: FormControl;
    descriptionControl?: FormControl;
    refresher?: Function;
    filterLinks?: IFilterLink[];
}

export interface IFilterLink {
    filterFieldKey: string;
    formKey: string;
    formFieldKey: string;
}

@Injectable()
export class FormService {

    formsRepo: { [key: string]: FormGroup };

    constructor(private menuService: MenuService) {
    }

    public createFormControl(init?: any, requred?: boolean): FormControl {
        return new FormControl(init, requred ? [Validators.required] : null);
    }

    public registerFields(fields: IFieldSetting[], form: FormGroup): void {

        fields.forEach(field => {
            form.registerControl(field.id, field.control);
        });

    }

    public closeForm() {
        //this.menuService.menuStream$.next(null);
        this.menuService.submenuStream$.next(null);
    }

    registerInRepo(key: string, form: FormGroup) {
        if(!this.formsRepo) this.formsRepo = {};
        this.formsRepo[key] = form;
    }

    unregisterFormRepo(key: string){
        delete this.formsRepo[key];
    }

    getFormFieldVC$(formKey: string, fieldKey: string): Observable<string | number> {
        if(this.formsRepo && this.formsRepo[formKey]){
            return this.formsRepo[formKey].valueChanges.pipe(
                filter(data => !!data),
                distinctUntilChanged((prev, next) => prev[fieldKey] === next[fieldKey]),
                pluck(fieldKey),
            );
        } else {
            console.error('Форма или поле не зарегестрированы', formKey, fieldKey);
            return of(null);
        }
    }

}
