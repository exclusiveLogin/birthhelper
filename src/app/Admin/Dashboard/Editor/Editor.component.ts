import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IFieldSetting, FormService } from '../../form.service';
import { DictService, IDictItem } from '../../dict.service';
import { IRowSetting } from '../../table/table/cell/cell.component';
import { ITableItem } from '../../table/table/table.component'
import { EMENUMODE, IMenuRepo } from '../Dashboard.component';
import { IEntityItem, EntityService } from '../../entity.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './Editor.component.html',
  styleUrls: ['./Editor.component.css']
})
export class EditorComponent implements OnInit {

  @Input() mode: EMENUMODE;
  @Input() menu: IMenuRepo;

  private currentService: IEntityItem;
  public refresh: Function;
  //public _key: string = 'services';

  constructor(
    private dict: DictService,
    private forms: FormService,
    private ent: EntityService,
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

  public form: FormGroup = new FormGroup({});
  
  public fields: IFieldSetting[] = [
      {
        id: 'title',
        type: 'string',
        title: 'Название услуги',
        requred: true,
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
        canBeNull: false,
        initData: 1,
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
      field.control = this.forms.createFormControl(null, field.requred);
      // готовим словари
      if ( !!field.useDict && !!field.dctKey ){
          field.initData ?  
            field.control.setValue(field.initData) : 
            field.control.setValue(null);
          field.loaded = false;
          this.dict.getDict( field.dctKey ).subscribe( ( dict: IDictItem[] ) => field.dctItems = dict);
      }
    });

    this.forms.registerFields(this.fields, this.form);

    console.log('form:', this.form);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes.mode.currentValue === EMENUMODE.CREATE) this.currentService = null;
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

  public refreshAssign(e){
    this.refresh = e;
  }

  public selectServiceFromTable( service: ITableItem ){
    if(!service) {this.currentService = null; return;}
    console.log('selected service id: ', service.data.id);
    
    this.currentService = service.data;

    // заполняем поля формы
    if( service.data ) Object.keys( service.data ).forEach( key => {
      if( key in service.data ){
        // определяем наличие формы
        let target = this.fields.find( f => f.id === key);
        if( !!target && target.control ) target.control.setValue( service.data[ key ]);
      } 
    }) 
  }

  public removeEntity(){
    if(this.currentService && confirm("Уверен что хочешь удалить услугу?")){
      this.ent.remEnt(this.menu.name, this.currentService.id).subscribe(result => {
        this.refresh();
        this.currentService = null;
      });
    }
  }

  public createEntity(){
    if(this.currentService && confirm("Уверен что хочешь создать услугу?")){
      this.ent.remEnt(this.menu.name, this.currentService.id).subscribe(result => {
        this.refresh();
        this.currentService = null;
      });
    }
  }

  public close(){
    this.forms.closeForm();
  }
}

