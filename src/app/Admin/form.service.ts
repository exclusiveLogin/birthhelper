import { Injectable } from '@angular/core';

export interface IFieldSetting {
  id: string;
  title: string;
  type?: string;
  useDict?: boolean;
  dctKey?: string;
}

@Injectable()
export class FormService {

  constructor() { }

}
