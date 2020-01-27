import { Injectable } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MenuService } from './Dashboard/menu.service';

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
  dictSelected?:any;
  canBeNull?: boolean;
  control?: FormControl;
  mirrorControl?: FormControl;
  readonly?: boolean;
  hide?: boolean;
  proxyTo?: string;
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
}

@Injectable()
export class FormService {

  constructor( private menuService: MenuService ) { }

  public createFormControl( init?:any, requred?: boolean): FormControl {
    return new FormControl(init, requred ? [Validators.required] : null);
  }

  public registerFields( fields: IFieldSetting[], form: FormGroup ): void {

    fields.forEach(field => {
      form.registerControl( field.id, field.control);
    });

  }

  public closeForm(){
    //this.menuService.menuStream$.next(null);
    this.menuService.submenuStream$.next(null);
  }
}
