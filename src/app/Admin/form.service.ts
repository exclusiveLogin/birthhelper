import { Injectable } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';

export interface IFieldSetting {
  id: string;
  title: string;
  type?: string;
  useDict?: boolean;
  dctKey?: string;
  dctItems?: any[];
  loaded?: boolean;
  requred?: boolean;
  initData?: any;
  dictSelected?:any;
  canBeNull?: boolean;
}

@Injectable()
export class FormService {

  constructor() { }

  public createFormControl( init?:any, requred?: boolean): FormControl {
    return new FormControl(init, requred ? Validators.required : null);
  }

  public createForm( fields: IFieldSetting[] ): FormGroup {

    let controls: { [name: string]: AbstractControl };

    fields.forEach( field => {
      controls[ field.id ] = this.createFormControl( field.initData ? field.initData : '', field.requred );
    });

    return new FormGroup( controls );
  }
}
