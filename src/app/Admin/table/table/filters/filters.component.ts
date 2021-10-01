import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ITableFilter} from '../table.component';
import {FormService} from '../../../form.service';
import {Observable, merge, Subscription} from 'rxjs';
import {debounceTime, filter, map, mergeAll, mergeMap, startWith, switchMap, tap} from 'rxjs/operators';
import {FormGroup} from '@angular/forms';

export interface IFiltersParams {
    [name: string]: string;
}

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {

    constructor(
        private forms: FormService,
    ) {
    }

    @Input('filters') public fields$: Observable<ITableFilter[]>;
    @Output() public update: EventEmitter<IFiltersParams> = new EventEmitter(null);

    private filters: IFiltersParams = {};
    public fields: ITableFilter[];
    private flpSubs: Subscription[] = [];
    private fieldSub: Subscription;
    public form = new FormGroup({});

    ngOnInit() {

        if (this.fields$) {
            this.fieldSub = this.fields$.pipe(
                // all fields
                filter(f => !!f && !!f.length),
                tap(f => this.fields = f || []),
                tap((f) => f.forEach(ff => {
                    if (ff.value) {
                        ff.control.setValue(ff.value);
                        this.setFilters(ff.name, ff.value);
                    }
                })),
                tap(f => console.log('tap', f, this.filters)),
                switchMap(fields => {
                    const flp = this.fields.filter(f => !!f.formLink).map(f => ({...f.formLink, key: f.name}));
                    console.log('D flp', flp);
                    return merge(...fields.map(f => f.type === 'string' ?
                        f.control.valueChanges.pipe(debounceTime(1000), map(val => [f.name, val])) :
                        f.control.valueChanges.pipe(map(val => [f.name, val]))
                    ),
                        ...flp.map(_ => this.forms.getFormFieldVC$(_.formKey, _.formFieldKey)
                            .pipe(
                                tap(data => console.log('D flp', data)),
                                map(value => [_.key, value]))),
                    );
                }),
            ).subscribe((data) => {
                console.log('D data', data);
                const d = data as any as [string, string];
                console.log('D', d);
                const [name, value] = d;
                this.setFilters(name, value);
            });
        }

        console.log('filters:', this.fields);
    }

    private setFilters(name: string, value: any) {
        const targetField = this.fields.find(f => f.name === name);
        if (targetField.type === 'flag') {
            value = !!value ? '1' : null;
        }
        this.filters[name] = value;

        Object.keys(this.filters).forEach(key => {
            if (!this.filters[key]) {
                delete this.filters[key];
            }
        });

        console.log('cleared filters: ', this.filters);
        this.updateTable();
    }

    private updateTable() {
        this.update.emit(this.filters);
    }

    ngOnDestroy(): void {
        this.fieldSub.unsubscribe();
        this.flpSubs.forEach(f => f.unsubscribe());
        this.flpSubs = [];
    }
}
