import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProviderService} from '../provider.service';
import {IDictItem} from '../../dict.service';
import {IEntityItem, ISet} from '../../entity.model';
import {IRowSetting} from './cell/cell.component';
import {IFiltersParams} from './filters/filters.component';
import {IRestParams} from '../../rest.service';
import {environment} from '../../../../environments/environment';
import {catchError, filter, finalize, map, switchMap, take, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {FormService, IFilterLink} from '../../form.service';
import {Observable, of, Subject} from 'rxjs';

export interface ITableRows {
  title?: string;
  type?: any;
  width?: string;
  key?: string;
}

export interface ITableItem {
  data: IEntityItem | IDictItem;
  text?: string;
  selected?: boolean;
  image?: string;
}

export interface ITableFilter {
  name: string;
  title: string;
  type: string;
  db_name: string;
  readonly?: boolean;
  items$: Observable<IDictItem[]>;
  control: FormControl;
  value?: any;
  formLink?: {
    formKey?: string,
    formFieldKey?: string,
  };
}

export interface IImageOptions {
  urlType: string;
  urlKey: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(
    private provider: ProviderService,
  ) {
  }
  @Input() public key: string;
  @Input() public type: string;
  @Input() public imageOptions: IImageOptions;
  @Input() private multiselect = false;
  @Input() public dummyItems: ITableItem[];
  @Input() public df: string[];
  @Input() public title: string;
  @Input() public filters: ITableFilter[];

  @Output() private select: EventEmitter<ITableItem | ITableItem[]> = new EventEmitter();
  @Output() private deselect: EventEmitter<number> = new EventEmitter();
  @Output() private deselector$: EventEmitter<Function> = new EventEmitter();
  @Output() private refresh: EventEmitter<Function> = new EventEmitter();

  public items: ITableItem[] = [];
  public filters$: Observable<ITableFilter[]>;
  public currentPage = 1;
  public total = 0;
  public allPages = 1;
  public paginator = true;
  public currentItem: ITableItem;
  public currentItems: ITableItem[];
  public rowSettings: IRowSetting[];
  public currentError: string;
  private refreshTable$ = new Subject();
  private qp: IRestParams = {};

  items$ = this.refreshTable$.pipe(
    switchMap(() => this.refreshSet()),
    map((set) => ({
      cont: set.container,
      slot: set.slot,
      set,
    })),
    map((data) => {
      let needUpdateSet = false;
      if (this.type === 'repo') {
        needUpdateSet = true;
        if (data.cont) {
          this.type = 'entity';
          this.key = data.cont.entity_key;
        } else if (data.slot) {
          this.type = 'entity';
          this.key = data.slot.db_entity;
        }
      }
      return { ...data, set: data.set, needUpdateSet };
    }),
    switchMap((data) => {
      return data.needUpdateSet ? this.refreshSet() : of(data.set);
    }),
    switchMap(() => this.provider.getItemPage(this.key, this.type, this.currentPage, this.qp)),
    filter(data => !!data),
    map(data => (data as IEntityItem[]).map(i => this.converter(i))),
    catchError(err => {
      this.currentError = err.message ? err.message : err;
      return of([]);
    }),
  );

  private setStats(set: ISet) {
    this.total = set && set.total && Number(set.total);
    this.allPages = this.total ? Math.floor(this.total / 20) + 1 : 1;
    this.rowSettings = set.fields && set.fields.filter(f => !f.hide && !!f.showOnTable);
  }
  private refreshSet() {
    return this.provider.getItemsSet(this.key, this.type, this.qp).pipe(
      tap((set) => {
        this.setStats(set);
      }),
      catchError(err => this.currentError = err.message ? err.message : err)
    );
  }

  ngOnInit() {
    this.items$.subscribe(d => {
      this.items = d;
      this.finishItemsPhase();
    });

    this.filters$ = this.filters ?
      of(this.filters).pipe(
        tap(filters => {
          filters.forEach(f => {
            f.control = new FormControl({value: f.value || '', disabled: f.readonly });
            if (f.db_name) {
              f.items$ = this.provider.getFullDict(f.db_name).pipe(filter(d => !!d));
            }
          });
        })
      ) :
      this.provider.getFilters(this.key, this.type).pipe(
      tap(filters => {
        filters.forEach(f => {
          f.control = new FormControl({value: f.value || '', disabled: f.readonly });
          if (f.db_name) {
            f.items$ = this.provider.getFullDict(f.db_name).pipe(filter(d => !!d));
          }
        });
      }),
      catchError((err, c) => {
        this.currentError = err.message ? err.message : err;
        return of([]);
      }),
    );

    this.deselector$.emit(this.deselector.bind(this));

    if (this.key && this.type) {
      if (this.type === 'dummy') {
        this.provider.getItemsSet(this.key, 'entity').subscribe(dummySet => {
          if (!!dummySet) {
            this.setStats(dummySet);
            if (this.df) {
              this.rowSettings = this.rowSettings.filter(rs => this.df.some(f => f === rs.key));
            }
          }
        });
        return;
      }
    }
    this.refreshTable$.next();
    this.refresh.emit(this.refreshTable.bind(this));
  }

  private imageGenerator() {
    if (this.imageOptions && this.imageOptions.urlType === 'simple') {
      this.items.forEach(i => i.image = environment.static + '/' + i.data[this.imageOptions.urlKey]);
    }
  }

  private finishItemsPhase() {
    this.imageGenerator();
  }

  private deselector(id?: number) {
    if (!id) {
      this.items.forEach(i => i.selected = false);
      return;
    }
    this.items.forEach(i => {
      if (i.data.id === +id) {
        i.selected = false;
      }
    });
    console.log('YEP ', id, this.items);
  }

  private converter(data: IEntityItem | IDictItem): ITableItem {
    return <ITableItem>{
      data,
      text: data.id.toString()
    };
  }

  public hasImages(): boolean {
    return this.items.some(i => !!i.image);
  }

  public pageChanged(page: number, qp?: IRestParams) {
    console.log('page changed: ', page);
    this.currentPage = page;
    this.refreshTable$.next();
  }

  public refreshTable(filters: IFiltersParams) {
    console.log('refresh table:', filters);
    this.paginator = filters ? !Object.keys(filters).some(k => !!k) : true;
    this.currentItem = null;
    this.qp = filters;
    this.pageChanged(1, filters as IRestParams);
  }

  public selectItem(item: ITableItem) {
    console.log('selected:', item);
    if (this.multiselect) {
      item.selected = true;
      const newItem = JSON.parse(JSON.stringify(item));
      this.currentItems = [newItem];
      if (this.currentItems[0].selected) {
        this.select.emit(this.currentItems);
      }

      return;
    }

    this.select.emit(item);
    this.currentItem = item;
  }

  public unselectItem() {
    this.select.emit(null);
    this.currentItem = null;

    this.currentItems = [];
  }

  public deselectItem(item: ITableItem) {
    this.deselect.emit(item.data.id);
    console.log('rem dummyExist:', this.dummyItems);
  }
}
