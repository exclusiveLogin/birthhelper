import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ITableFilters} from '../table.component';
import {FormService, IFilterLink} from "../../../form.service";

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

    @Input('filters') public fields: ITableFilters[];
    @Input('filterLinkParams') flp: IFilterLink[] = [];
    @Output() public update: EventEmitter<IFiltersParams> = new EventEmitter(null);

    private filters: IFiltersParams = {};
    private printTimer;

    ngOnInit() {
        this.flp.forEach(f => this.forms.getFormFieldVC$(f.formKey, f.formFieldKey).subscribe(value => {
            const tf = this.fields.find(field => field.name === f.filterFieldKey);
            if (tf){
                tf.control.setValue(value);
                this.setFilters(f.filterFieldKey, value);
            }
        }));
        console.log('filters:', this.fields);
    }

    public selectFilters(field, ev) {
        let value = ev && ev.target && ev.target.value;
        this.setFilters(field.name, value);
    }

    public printFilters(ev, name: string) {
        let value = ev && ev.target && ev.target.value;

        if (this.printTimer) {
            clearTimeout(this.printTimer);
            this.printTimer = null;
        }
        this.printTimer = setTimeout(() => {
            this.setFilters(name, value);
            this.printTimer = null;
        }, 2000);

    }

    private setFilters(name: string, value: any) {
        this.filters[name] = value;

        Object.keys(this.filters).forEach(key => {
            if (!this.filters[key]) delete this.filters[key];
        });

        console.log('cleared filters: ', this.filters);
        this.updateTable();
    }

    private updateTable() {
        this.update.emit(this.filters)
    }
}
