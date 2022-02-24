import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProviderService} from '../provider.service';
import {IDictItem} from '../../dict.service';
import {IEntityItem, ISet} from '../../entity.model';
import {IRowSetting} from './cell/cell.component';
import {IFiltersParams} from './filters/filters.component';
import {IRestParams} from '../../rest.service';
import {environment} from '@environments/environment';
import {catchError, filter, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {SafeUrl} from '@angular/platform-browser';
import {ImageService} from '@services/image.service';
import {IImage} from '../../Dashboard/Editor/components/image/image.component';

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
    image$?: Observable<SafeUrl>;
    imageSignal$?: BehaviorSubject<null>;
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
    valueKey?: string;
    override?: boolean;
    formLink?: {
        formKey?: string,
        formFieldKey?: string,
    };
}

export interface IImageOptions {
    urlType: string;
    urlKey: string;
}

@UntilDestroy()
@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

    constructor(
        private provider: ProviderService,
        private imageService: ImageService,
    ) {
    }

    @Input() public linker$: BehaviorSubject<ITableItem[]>;
    @Input() public key: string;
    @Input() public type: string;
    @Input() public imageOptions: IImageOptions;
    @Input() private multiselect = false;
    @Input() public title: string;
    @Input() public filters: ITableFilter[];

    @Output() private select: EventEmitter<ITableItem | ITableItem[]> = new EventEmitter();
    @Output() private refresh: EventEmitter<Function> = new EventEmitter();

    public items: ITableItem[] = [];
    public filters$: Observable<ITableFilter[]>;
    public currentPage = 1;
    public total = 0;
    public allPages = 1;
    public currentItem: ITableItem;
    public currentItems: ITableItem[];
    public rowSettings: IRowSetting[];
    public currentError: string;
    private refreshTable$ = new Subject();
    private qp: IRestParams = {};

    items$: Observable<ITableItem[]> = this.refreshTable$.pipe(
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
            return {...data, set: data.set, needUpdateSet};
        }),
        switchMap((data) => {
            return data.needUpdateSet ? this.refreshSet() : of(data.set);
        }),
        switchMap(() => this.provider.getItemPage(this.key, this.type, this.currentPage, this.qp)),
        filter(data => !!data),
        map(data => (data as IEntityItem[]).map(i => this.converter(i))),
        publishReplay<ITableItem[]>(1), refCount<ITableItem[]>(),
        catchError(err => {
            this.currentError = err.message ? err.message : err;
            return of([]);
        }),
        untilDestroyed(this),
    ) as Observable<ITableItem[]>;

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
            catchError(err => {
                this.currentError = err.message ? err.message : err;
                return of(null);
            }),
        );
    }

    ngOnInit() {
        const dummyMode = this.type === 'dummy';

        if (this.linker$) {
            let l$: Observable<any> = this.linker$;

            if (dummyMode) {
                l$ = l$.pipe(
                    tap(list => this.items = list),
                );
            } else {
                l$ = combineLatest([l$, this.items$]).pipe(
                    tap(([selected, items]) => {
                        items.forEach(i => i.selected = false);
                        selected.forEach(it => {
                            const target = items.find((i: ITableItem) => i.data.id === it.data.id);
                            if (target) {
                                target.selected = true;
                            }
                        });
                    })
                );
            }

            l$.pipe(untilDestroyed(this)).subscribe();
        }

        this.items$.subscribe(d => {
            this.items = d;
            this.finishItemsPhase();
        });

        this.filters$ = this.filters
            ? combineLatest([of(this.filters), this.provider.getFilters(this.key, this.type)]).pipe(
                map(filters => ([...filters[0], ...filters[1]])),
                tap(filters => {
                    filters.forEach(f => {
                        f.control = new FormControl({value: f.value || '', disabled: f.readonly});
                        if (f.db_name) {
                            f.items$ = this.provider.getFullDict(f.db_name).pipe(filter(d => !!d));
                        }
                    });
                })
            )
            : this.provider.getFilters(this.key, this.type).pipe(
                tap(filters => {
                    filters.forEach(f => {
                        f.control = new FormControl({value: f.value || '', disabled: f.readonly});
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

        if (this.key && this.type) {
            if (this.type === 'dummy') {
                this.provider.getItemsSet(this.key, 'entity').subscribe(dummySet => {
                    if (!!dummySet) {
                        this.setStats(dummySet);
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
            this.items.forEach(i => {
                const imgData = this.imageService.getImage$(i.data as IImage);
                i.image$ = imgData[0];
                i.imageSignal$ = imgData[1];
            });
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
    }

    private converter(data: IEntityItem | IDictItem): ITableItem {
        return <ITableItem>{
            data,
            text: data.id.toString()
        };
    }

    public hasImages(): boolean {
        return this.items.some(i => !!i.image$);
    }

    public pageChanged(page: number, qp?: IRestParams) {
        this.currentPage = page;
        this.refreshTable$.next();
    }

    public refreshTable(filters: IFiltersParams) {
        this.currentItem = null;
        this.qp = filters ? filters : this.qp;
        this.pageChanged(this.currentPage, filters as IRestParams);
    }

    public selectItem(item: ITableItem) {
        if (this.multiselect) {
            item.selected = !item.selected;
            const newItem = JSON.parse(JSON.stringify(item));
            this.currentItems = [newItem];

            if (this.currentItems[0].selected) {
                this.select.emit(this.currentItems);
            }

            if (this.linker$) {
                this.linker$.next(this.items.filter(f => !!f.selected));
            }

            return;
        } else {
            this.items.forEach(i => i.selected = false);
            item.selected = true;
        }

        this.select.emit(item);
        this.currentItem = item;
    }

    public unselectItem() {
        this.items.forEach(i => i.selected = false);
        this.select.emit(null);
        this.currentItem = null;

        this.currentItems = [];
    }

    public isDummy(): boolean {
        return this.type === 'dummy';
    }

    public deselectItem(item: ITableItem) {
        item.selected = false;
        if (this.linker$) {
            this.linker$.next(this.items.filter(f => !!f.selected));
        }
    }
}
