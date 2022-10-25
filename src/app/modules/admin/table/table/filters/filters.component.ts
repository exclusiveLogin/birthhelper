import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ITableFilter} from '../table.component';
import {FormService} from '../../../form.service';
import {Observable, merge, Subscription} from 'rxjs';
import {debounceTime, filter, map, switchMap, tap} from 'rxjs/operators';
import {FormGroup} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

export interface IFiltersParams {
    [name: string]: string;
}

@UntilDestroy()
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

    @Input() public fields$: Observable<ITableFilter[]>;
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
                switchMap(fields => {
                    const flp = this.fields.filter(f => !!f.formLink).map(f => ({...f.formLink, key: f.name}));
                    return merge(
                        ...fields.map(f => f.type === 'string' ?
                            f.control.valueChanges.pipe(debounceTime(1000), map(val => [f.name, val])) :
                            f.control.valueChanges.pipe(map(val => [f.name, val]))
                        ),
                        ...flp.map(_ => this.forms.getFormFieldVC$(_.formKey, _.formFieldKey)
                            .pipe(
                                map(value => [_.key, value]))),
                    );
                }),
                untilDestroyed(this),
            ).subscribe((data) => {
                const d = data as any as [string, string];
                const [name, value] = d;
                this.setFilters(name, value);
            });
        }
    }

    private setFilters(name: string, value: any) {
        const targetField = this.fields.find(f => f.name === name);
        if (!targetField) { return; }

        switch (targetField.type) {
            case 'flag':
                value = !!value ? '1' : null;
                break;
            default:
                targetField.control.setValue(value, {emitEvent: false});
        }
        this.filters[name] = value;

        Object.keys(this.filters).forEach(key => {
            if (!this.filters[key]) {
                delete this.filters[key];
            }
        });
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
