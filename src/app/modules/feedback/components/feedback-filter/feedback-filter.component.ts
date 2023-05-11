import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { LkService } from "@services/lk.service";

export type FilterType = 'status' | 'type_contragent' | 'period';

@Component({
    selector: "app-feedback-filter",
    templateUrl: "./feedback-filter.component.html",
    styleUrls: ["./feedback-filter.component.scss"],
})
export class FeedbackFilterComponent implements OnInit {
    constructor(private lkService: LkService) {}

    @Input() filters: Array<FilterType> = ['status', 'type_contragent', 'period'];

    filterForm = new FormGroup({
        status: new FormControl("pending"),
        section_key: new FormControl("clinic"),
    });

    ngOnInit(): void {
        this.filterForm.valueChanges.subscribe((data) => {
            console.log("this.filterForm.valueChanges", data);
            this.lkService.setFilters("feedback", data);
        });
        this.filterForm.updateValueAndValidity();
    }

    get hasStatusFilter(): boolean {
        return this.filters.some((f) => f === 'status');
    }

    get hasTypeFilter(): boolean {
        return this.filters.some((f) => f === 'status');
    }

    get hasPeriodFilter(): boolean {
        return this.filters.some((f) => f === 'status');
    }
}
