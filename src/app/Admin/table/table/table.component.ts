import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProviderService } from '../provider.service';
import { IDictItem } from '../../dict.service';
import { IEntity, IEntityItem } from '../../entity.service';
import { IRowSetting } from './cell/cell.component';
import { IFiltersParams } from './filters/filters.component';
import { IRestParams } from '../../rest.service';
import { IContainer } from '../../container.service';

export interface ITableRows{
  title?: string;
  type?:any;
  width?:string;
  key?:string;
}

export interface ITableItem{
  data: IEntityItem | IDictItem;
  text?: string;
  selected?: boolean;
}

export interface ITableFilters{
  name: string,
  title: string,
  type: string,
  db_name: string,
  items: IDictItem[], 
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input('key') public key: string;
  @Input('type') public type: string;
  @Input('multiselect') private multiselect: boolean = false;
  @Input('dummyItems') public dummyItems: ITableItem[];
  @Input('dummyFields') public df: string[];
  @Input() public title: string;

  @Output() private select: EventEmitter<ITableItem | ITableItem[]> = new EventEmitter();
  @Output() private deselect: EventEmitter<number> = new EventEmitter();
  @Output() private deselector$: EventEmitter<Function> = new EventEmitter();
  @Output() private refresh: EventEmitter<Function> = new EventEmitter();

  constructor(
    private provider: ProviderService
  ) { }

  public items: ITableItem[] = [];
  public filters: ITableFilters[] = [];
  public currentPage: number = 1;
  public total: number = 0;
  public allPages: number = 1;
  public currentItem: ITableItem;
  public currentItems: ITableItem[];
  public rowSettings: IRowSetting[];
  public currentError: string;

  ngOnInit() {
    this.deselector$.emit(this.deselector.bind(this));
    if( this.key && this.type ) {
      if(this.type === 'dummy'){
        this.provider.getItemsSet( this.key, 'entity' ).subscribe(dummySet => {
          if(!!dummySet){
            this.rowSettings = dummySet.fields && dummySet.fields.filter(f => !f.hide && !!f.showOnTable).map(f => ({key: f.key, title: f.title}));
            if(this.df) this.rowSettings = this.rowSettings.filter(rs => this.df.some(f => f === rs.key));
          }
        })
      }
      // запрос сета для определения статистики таблицы
      this.provider.getItemsSet( this.key, this.type ).subscribe(set => {
        if(!!set){
          this.total = set && set.total && Number(set.total);
          this.allPages = this.total ? Math.floor( this.total / 20 ) + 1 : 1;
          this.rowSettings = set.fields && set.fields.filter(f => !f.hide && !!f.showOnTable).map(f => ({key: f.key, title: f.title}));

          // запрос первой страницы таблицы при инициализации
          if(this.type === 'repo') {
            const cont: IContainer = set.container;
            if(cont){
              this.type = 'entity';
              this.key = cont.db_entity;
              this.provider.getItemsSet( this.key, this.type )
                .subscribe(newset => {
                  this.total = newset && newset.total && Number(newset.total);
                  this.allPages = this.total ? Math.floor( this.total / 20 ) + 1 : 1;
                  this.rowSettings = newset.fields && newset.fields.filter(f => !f.hide && !!f.showOnTable).map(f => ({key: f.key, title: f.title}));
                  this.provider.getItemsFirstPortion( this.key, this.type )
                    .subscribe((items: IEntityItem[] ) => this.items = items && <ITableItem[]>items.map(i => this.converter(i)),
                      (err) => this.currentError = err.message ? err.message : err);
                }, (err) => this.currentError = err.message ? err.message : err);
            }
          } else{
            this.provider.getItemsFirstPortion( this.key, this.type )
              .subscribe((items: ( IDictItem | IEntityItem)[] ) => this.items = items && <ITableItem[]>items.map(i => this.converter(i)),
               (err) => this.currentError = err.message ? err.message : err);
          }
        }
      }, (err) => this.currentError = err.message ? err.message : err);
      // запрос фильтров таблицы
      this.provider.getFilters( this.key, this.type ).subscribe( filters => {
        this.filters = filters;
        this.initFilterDictionaries();
      }, (err) => this.currentError = err.message ? err.message : err);
    }
    this.refresh.emit(this.refreshTable.bind(this));
  }

  private deselector(id: number){
    this.items.forEach(i => {
      debugger;
      if(i.data.id == +id) i.selected = false;  
    });
    console.log("YEP ", id, this.items);
  }

  private initFilterDictionaries(): void {
    if( this.filters && this.filters.length ){
      this.filters.forEach((f: ITableFilters) => {
        if( f.db_name ) this.provider.getFullDict(f.db_name).subscribe(d => f.items = !!d ? d : null);
      });
      console.log('init filters:', this.filters);
    }
  }

  private converter( data: IEntityItem | IDictItem ): ITableItem{
    return <ITableItem>{
      data,
      text: data.id.toString()
    }
  }

  public pageChanged(page: number, qp?: IRestParams){
    console.log('page changed: ', page);
    this.currentPage = page;
    this.provider.getItemPage( this.key, this.type, page, qp )
      .subscribe((items: (IDictItem | IEntityItem)[] ) => {
        this.items = items && <ITableItem[]>items.map(i => this.converter(i));
        //this.total = items.length;
        //this.allPages = Math.floor( this.total / 20 ) + 1;
        //@todo сделать пересчет сета при работе с фильтрами
      },
      (err) => this.currentError = err.message ? err.message : err);
  }

  public refreshTable( filters: IFiltersParams){
    console.log('refresh table:', filters);
    this.currentItem = null;
    this.pageChanged(1, filters as IRestParams);
  }

  public selectItem( item: ITableItem ){
    console.log("selected:", item);
    if(this.multiselect) {
      item.selected = true;
      let newItem = JSON.parse(JSON.stringify(item));
      this.currentItems = [ newItem ];
      if(this.currentItems[0].selected) this.select.emit(this.currentItems);
      
      return;
    }

    this.select.emit( item );
    this.currentItem = item;
  }

  public unselectItem(){
    this.select.emit( null );
    this.currentItem = null;

    this.currentItems = [];
  }

  public deselectItem(item: ITableItem){
    this.deselect.emit(item.data.id);
    console.log("rem dummyExist:", this.dummyItems);
  }
}
