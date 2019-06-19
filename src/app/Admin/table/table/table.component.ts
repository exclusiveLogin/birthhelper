import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from '../provider.service';
import { IDictItem } from '../../dict.service';
import { IEntity, IEntityItem } from '../../entity.service';
import { IRowSetting } from './cell/cell.component';

export interface ITableRows{
  title?: string;
  type?:any;
  width?:string;
  key?:string;
}

interface ITableItem{
  data: any;
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


  constructor(
    private provider: ProviderService
  ) { }

  public items: ITableItem[] = [];
  public filters: ITableFilters[] = [];
  public currentPage: number = 1;
  public total: number = 0;
  public allPages: number = 1;

  ngOnInit() {
    if( this.key && this.type ) {
      // запрос первой страницы таблицы при инициализации
      this.provider.getItemsFirstPortion( this.key, this.type ).subscribe((items: IDictItem[] | IEntityItem[]) => this.items = items && <ITableItem[]>items.map(i => this.converter(i)));
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
  }

  private initFilterDictionaries(): void {
    if( this.filters && this.filters.length ){
      this.filters.forEach((f: ITableFilters) => {
        if( f.db_name ) this.provider.getFullDict(f.db_name).subscribe(d => f.items = !!d ? d : null);
      });
      console.log('init filters:', this.filters);
    }
  }

  private converter( data: IEntityItem | IDictItem ){
    return <ITableItem>{
      data,
      text: data.id.toString()
    }
  }

  public pageChanged(page: number){
    console.log('page changed: ', page);
    this.provider.getItemPage( this.key, this.type, page ).subscribe((items: IDictItem[] | IEntityItem[]) => this.items = items && <ITableItem[]>items.map(i => this.converter(i)));
  }

}
