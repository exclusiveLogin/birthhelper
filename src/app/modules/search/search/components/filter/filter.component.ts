import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {SearchSection} from '../../../../../models/filter.interface';
import {FormControl} from '@angular/forms';


export interface FilterResult {
    [key: string]: { [id: number]: any };
}

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {

    @Input() filterConfig: SearchSection[];
    @Output() filterChange = new EventEmitter();

    resetForm(): void {
        this.filterConfig.forEach(section => {
            if (section.type === 'flag') {
                section.filters.forEach(f => f.control.reset());
            }
            if (section.type === 'select') {
                section.control.reset();
            }
        });

        this.submitForm();
    }

    submitForm(): void {
        console.log('Filter form:', this);
        const filters = this.serializer();
        this.filterChange.emit(filters);
    }

    serializer(): FilterResult {
        const resultSection = this.filterConfig.map(section => {
            const selected = [];
            switch (section.type) {
                case 'flag':
                    const sel = section.filters.filter(fl => !!fl.control.value).map(fl => ({[fl.id]: true}));
                    selected.push(...(sel.length ? sel : []));
                    break;
                case 'select':
                    const selectedId = section.control.value;
                    if (selectedId === null || selectedId === 'null') break;
                    selected.push(({[selectedId]: true}));
                    break;
            }
            return {sectionKey: section.key, selected: selected.filter(f => !!f)};
        });

        let data;
        resultSection.forEach(rs => {
            if (rs.selected.length) {
                if (!data) {
                    data = {};
                }
                console.log('selected', rs.selected);
                data[rs.sectionKey] = {};
                rs.selected.forEach(s => data[rs.sectionKey] = {...data[rs.sectionKey], ...s});
            }
        });
        console.log('serializer, resultSection', resultSection, data);

        return data;
    }

    constructor(
        private cdr: ChangeDetectorRef,
    ) {
    }

    createForm(): void {
        if (this.filterConfig) {
            this.filterConfig.forEach(section => {
                switch (section.type) {
                    case 'select':
                        section.control = new FormControl(section.preInitValue ?? 'null');
                        break;
                    case 'flag':
                        section.filters.forEach(filter => filter.control = new FormControl(filter.preInitValue ?? false));
                        break;
                }
            });
        }

        this.cdr.markForCheck();
    }

    ngOnInit(): void {
        this.createForm();
    }

}
