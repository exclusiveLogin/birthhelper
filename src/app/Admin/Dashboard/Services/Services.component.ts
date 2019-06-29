import { Component, OnInit, Input } from '@angular/core';
import { IFieldSetting, FormService } from '../../form.service';
import { DictService, IDictItem } from '../../dict.service';
import { RestService } from '../../rest.service';
import { IRowSetting } from '../../table/table/cell/cell.component';
import { ITableItem } from '../../table/table/table.component'
import { EMENUMODE } from '../Dashboard.component';
import { FormControl } from '@angular/forms';

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
    private forms: FormService,
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
        dctKey: 'dict_trimester_service',
        canBeNull: true,
      }
    ];

  ngOnInit() {
    this.fields.forEach( field => {
      // добавить валидаторы если потом введем в систему
      field.control = new FormControl('');
      // готовим словари
      if ( !!field.useDict && !!field.dctKey ){
          field.control.setValue(null);
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

    // заполняем поля формы
    if( service.data ) Object.keys( service.data ).forEach( key => {
      if( key in service.data ){
        // определяем наличие формы
        let target = this.fields.find( f => f.id === key);
        if( !!target && target.control ) target.control.setValue( service.data[ key ]);
      } 
    }) 
  }

  public close(){
    this.forms.closeForm();
  }
}

