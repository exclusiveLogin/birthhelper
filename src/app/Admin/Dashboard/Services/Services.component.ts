import { Component, OnInit } from '@angular/core';
import { IFieldSetting } from '../../form.service';
import { DictService, IDictItem } from '../../dict.service';
import { RestService } from '../../rest.service';

@Component({
  selector: 'app-Services',
  templateUrl: './Services.component.html',
  styleUrls: ['./Services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(
    private dict: DictService,
    private rest: RestService
  ) { }

  public fields: IFieldSetting[] = [
      {
        id: 'title',
        type: 'string',
        title: 'Название услуги'
      },
      {
        id: 'description',
        type: 'text',
        title: 'Описание услуги'
      },
      {
        id: 'category',
        type: 'select',
        useDict: true,
        title: 'Категория услуги',
        dctKey: 'dict_category_service',
      },
      {
        id: 'trimester',
        type: 'select',
        useDict: true,
        title: 'Триместер услуги',
        dctKey: 'dict_trimesters'
      }
    ];

  ngOnInit() {
    this.fields.forEach( field => {
      // готовим словари
      if ( !!field.useDict && !!field.dctKey ){
          field.loaded = false;
          this.dict.getDict( field.dctKey ).subscribe( ( dict: IDictItem[] ) => field.dctItems = dict);
      }
    })
  }

}
