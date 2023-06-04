import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { LkService } from "@services/lk.service";

export type FilterType = 'status' | 'type_contragent' | 'period';

@Component({
    selector: "app-feedback-filter",
    templateUrl: "./feedback-filter.component.html",
    styleUrls: ["./feedback-filter.component.scss"],
})
export class FeedbackFilterComponent implements OnInit {
    constructor() {}

    @Input() filters: Array<FilterType> = ['status', 'type_contragent', 'period'];
    @Output() onChange = new EventEmitter<{[key in FilterType]: any}>();

    filterForm = new FormGroup({
        status: new FormControl("pending"),
        section_key: new FormControl("clinic"),
    });

    ngOnInit(): void {
        this.filterForm.valueChanges.subscribe((data) => {
            console.log("FeedbackFilterComponent", data);
            this.onChange.emit(data);
        });
        this.filterForm.updateValueAndValidity();
    }

    get hasStatusFilter(): boolean {
        return this.filters.some((f) => f === 'status');
    }

    get hasTypeFilter(): boolean {
        return this.filters.some((f) => f === 'type_contragent');
    }

    get hasPeriodFilter(): boolean {
        return this.filters.some((f) => f === 'period');
    }
}
