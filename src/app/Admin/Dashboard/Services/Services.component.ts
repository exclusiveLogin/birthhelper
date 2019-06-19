import { Component, OnInit, Input } from '@angular/core';
import { IFieldSetting } from '../../form.service';
import { DictService, IDictItem } from '../../dict.service';
import { RestService } from '../../rest.service';
import { IRowSetting } from '../../table/table/cell/cell.component';
import { ITableItem } from '../../table/table/table.component'
import { EMENUMODE } from '../Dashboard.component';

@Component({
  selector: 'app-Services',
  templateUrl: './Services.component.html',
  styleUrls: ['./Services.component.css']
})
export class ServicesComponent implements OnInit {

  @Input() mode: EMENUMODE;
  private serviceId: number;

  constructor(
    private dict: DictService,
  ) { }

  public rowsServices: IRowSetting[] = [
    {
      key: 'id',
      title: 'ID'
    },
    {
      key: 'title',
      title: 'Название'
    },
    {
      key: 'description',
      title: 'Описание'
    },
    {
      key: 'category',
      title: 'Категория'
    },
  ]

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
        canBeNull: true,
      },
      {
        id: 'trimester',
        type: 'select',
        useDict: true,
        title: 'Триместер услуги',
        dctKey: 'dict_trimesters',
        canBeNull: true,
      }
    ];

  ngOnInit() {
    this.fields.forEach( field => {
      // готовим словари
      if ( !!field.useDict && !!field.dctKey ){
          field.loaded = false;
          this.dict.getDict( field.dctKey ).subscribe( ( dict: IDictItem[] ) => field.dctItems = dict);
      }
    });

    console.log('items:', this.fields);
  }

  public get isEditMode(): boolean{
    return this.mode === EMENUMODE.EDIT;
  }

  public get isCreateMode(): boolean{
    return this.mode === EMENUMODE.CREATE;
  }

  public get isDeleteMode(): boolean{
    return this.mode === EMENUMODE.DELETE;
  }

  public selectControl( item: IFieldSetting, ev){
    
    item.dictSelected = ev.target.value;
  
    console.log('selected:', item, ev);
  }

  public selectServiceFromTable( service: ITableItem ){
    console.log('selected service id: ', service.data.id);

  }
}
