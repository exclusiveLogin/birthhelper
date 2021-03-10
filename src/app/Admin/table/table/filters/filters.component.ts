import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ITableFilter} from '../table.component';
import {FormService, IFilterLink} from '../../../form.service';
import {Observable, merge, Subscription} from 'rxjs';
import {debounceTime, filter, map, mergeAll, mergeMap, tap} from 'rxjs/operators';
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
        tap(() => {
          const flp = this.fields.filter(f => !!f.formLink).map(f => ({...f.formLink, key: f.name}));

          this.flpSubs.forEach(s => s.unsubscribe());
          this.flpSubs = [];
          flp.forEach(f => {
            const sub = this.forms.getFormFieldVC$(f.formKey, f.formFieldKey).subscribe(value => {
              console.log('SUBS link key', f, ' value: ', value);
              const tf = this.fields.find(field => field.name === f.key);
              if (tf) {
                tf.control.setValue(value);
                this.setFilters(f.key, value);
              }
              this.flpSubs.push(sub);
            });
          });
        }),
        tap((f) => f.forEach(ff => {
          if (ff.value) {
            ff.control.setValue(ff.value);
            this.setFilters(ff.name, ff.value);
          }
        })),
        tap(f => console.log('tap', f, this.filters)),
        mergeMap(fields =>
          merge(fields.map(f => f.type === 'string' ?
            f.control.valueChanges.pipe(debounceTime(1000), map(val => [f.name, val])) :
            f.control.valueChanges.pipe(map(val => [f.name, val]))
          ))
        ),
        mergeAll(),
      ).subscribe((data) => {
        const d = data as any as [string, string];
        console.log('D', d);
        const [name, value] = d;
        this.setFilters(name, value);
      });
    }

    console.log('filters:', this.fields);
  }

  private setFilters(name: string, value: any) {
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
