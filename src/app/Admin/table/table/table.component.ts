import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProviderService } from '../provider.service';
import { IDictItem } from '../../dict.service';
import { IEntity, IEntityItem } from '../../entity.service';
import { IRowSetting } from './cell/cell.component';
import { IFiltersParams } from './filters/filters.component';

export interface ITableRows{
  title?: string;
  type?:any;
  width?:string;
  key?:string;
}

export interface ITableItem{
  data: IEntityItem | IDictItem;
  text?: string;
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
  @Input('key') private key: string;
  @Input('type') private type: string;
  @Input('rowsettings') private rowSettings: IRowSetting[];

  @Output() private select: EventEmitter<ITableItem> = new EventEmitter();
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

  ngOnInit() {
    if( this.key && this.type ) {
      // запрос первой страницы таблицы при инициализации
      this.provider.getItemsFirstPortion( this.key, this.type ).subscribe((items: ( IDictItem | IEntityItem)[] ) => this.items = items && <ITableItem[]>items.map(i => this.converter(i)));
      // запрос сета для определения статистики таблицы
      this.provider.getItemsSet( this.key, this.type ).subscribe(set => {
        this.total = set && set.total && Number(set.total);
        this.allPages = Math.floor( this.total / 20 ) + 1;
      });
      // запрос фильтров таблицы
      this.provider.getFilters( this.key, this.type ).subscribe( filters => {
        this.filters = filters;
        this.initFilterDictionaries();
      });
    }
    this.refresh.emit(this.refreshTable.bind(this));
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

  public pageChanged(page: number){
    console.log('page changed: ', page);
    this.currentPage = page;
    this.provider.getItemPage( this.key, this.type, page ).subscribe((items: (IDictItem | IEntityItem)[] ) => this.items = items && <ITableItem[]>items.map(i => this.converter(i)));
  }

  public refreshTable( filters: IFiltersParams[]){
    console.log('refresh table:', filters);
    this.currentItem = null;
    this.pageChanged(1);
  }

  public selectItem( item: ITableItem ){
    console.log("selected:", item);

    this.select.emit( item );
    this.currentItem = item;
  }

  public unselectItem(){
    this.select.emit( null );
    this.currentItem = null;
  }
}