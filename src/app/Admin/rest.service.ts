import { Injectable } from '@angular/core';
import { IDictItem } from './dict.service';

@Injectable()
export class RestService {

  constructor() { }

  public getFormFieldCurrentValue( name: string ): any {
    return null;
  }

  public getFormFieldVariants( name: string ): any[] {
    return null;
  }

  public getDict( name: string): IDictItem[] {
    return null;
  }

}
