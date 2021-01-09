import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ITableFilters} from '../table.component';
import {FormService, IFilterLink} from '../../../form.service';
import {Observable} from 'rxjs';
import {debounceTime, filter, map, mergeAll, mergeMap, tap} from 'rxjs/operators';
import {merge} from 'rxjs/observable/merge';

export interface IFiltersParams {
  [name: string]: string;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  constructor(
    private forms: FormService,
  ) {
  }

  @Input('filters') public fields$: Observable<ITableFilters[]>;
  @Input('filterLinkParams') flp: IFilterLink[] = [];
  @Output() public update: EventEmitter<IFiltersParams> = new EventEmitter(null);

  private filters: IFiltersParams = {};
  public fields: ITableFilters[];

  ngOnInit() {
    if (this.fields$) {
      this.fields$.pipe(
        // all fields
        filter(f => !!f && !!f.length),
        tap(f => this.fields = f),
        tap((f) => f.forEach(ff => {
          if(ff.value){
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
    //   if (!this.flp) this.flp = [];
    //     this.flp.forEach(f => this.forms.getFormFieldVC$(f.formKey, f.formFieldKey).subscribe(value => {
    //         const tf = this.fields.find(field => field.name === f.filterFieldKey);
    //         if (tf){
    //             tf.control.setValue(value);
    //             this.setFilters(f.filterFieldKey, value);
    //         }
    //     }));
    //     console.log('filters:', this.fields);
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
    this.update.emit(this.filters)
  }
}
