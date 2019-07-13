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
      // {
      //   id: 'title',
      //   type: 'string',
      //   title: 'Название услуги',
      //   requred: true,
      // },
      // {
      //   id: 'description',
      //   type: 'text',
      //   title: 'Описание услуги'
      // },
      // {
      //   id: 'category',
      //   type: 'select',
      //   useDict: true,
      //   title: 'Категория услуги',
      //   dctKey: 'dict_category_service',
      //   canBeNull: false,
      //   initData: 1,
      // },
      // {
      //   id: 'trimester',
      //   type: 'select',
      //   useDict: true,
      //   title: 'Триместер услуги',
      //   dctKey: 'dict_trimester_service',
      //   canBeNull: true,
      // }
    ];

  private rerenderFields(){
    console.log('rerender: ', this.fields);
    if(!(this.fields && this.fields.length)) return;
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
  }

  private rerenderValueOfFields(){
    console.log('rerender: ', this.fields);
    this.fields.forEach( field => {
      field.initData && field.control ?  
        field.control.setValue(field.initData) : 
        field.control.setValue(null);
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(!changes.mode) {
      //this.currentService = null;
      setTimeout(()=>this.close(),10);
      return;
    }
    if(changes.mode.currentValue === EMENUMODE.CREATE) {
      this.currentService = null;
      this.form.reset();
    }
    if(!!changes.menu.currentValue) {
      console.log("test menu changed", changes.menu);
      this.ent.getEntSet(this.menu.name).subscribe(set => {
        this.fields = set.fields && set.fields.map(f => {
          if(f.type === 'id' && !!f.useDict) f.type = 'select';
          f.id = f['key'];
          return f;
        });
        this.rerenderFields();
      });
    }
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
    if(!service) {this.currentService = null; this.form.reset(); this.rerenderValueOfFields(); return;}
    console.log('selected service id: ', service.data.id);
    
    this.currentService = service.data;

    // заполняем поля формы
    if( service.data ) Object.keys( service.data ).forEach( key => {
      if( key in service.data ){
        // определяем наличие формы
        let target = this.fields.find( f => f.id === key);
        console.log('target control: ', target);
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
    // собрать все поля формы в объект сущности
    let data: IEntityItem = this.form.value;
    for(let d in data) if(data[d] === null) delete data[d];
    //debugger;
    // отправить post с сущностью

    if(confirm("Уверен что хочешь создать услугу?")){
      this.ent.createEnt(this.menu.name, data).subscribe(result => {
        //this.refresh();
        console.log('create ent result: ', result);
        alert('Сущность успешно создана');
        this.form.reset();
        //this.currentService = null;
      });
    }
  }

  public editEntity(){

    let data: IEntityItem = this.form.value;
    for(let d in data) if(data[d] === null) delete data[d];

    if(this.currentService && confirm("Уверен что хочешь изменить услугу?")){

      data.id = this.currentService.id;
      this.ent.createEnt(this.menu.name, data).subscribe(result => {
        
        console.log('edit ent result: ', result);
        alert('Сущность успешно изменена');
        this.refresh();
        this.form.reset();
        this.currentService = null;
      
      });
    }
  }

  public close(){
    this.forms.closeForm();
  }
}

