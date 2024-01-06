import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

export type FilterType = "status" | "section" | "period";

@Component({
    selector: "app-feedback-filter",
    templateUrl: "./feedback-filter.component.html",
    styleUrls: ["./feedback-filter.component.scss"],
})
export class FeedbackFilterComponent implements OnInit {
    constructor() {}

    @Input() filters: Array<FilterType> = ["status", "section", "period"];
    @Input() defaults: { [key in FilterType]?: any } = {};
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onChange = new EventEmitter<{ [key in FilterType]: any }>();

    filterForm = new FormGroup({
        status: new FormControl(""),
        section: new FormControl("clinic"),
    });

    ngOnInit(): void {
        if ("status" in this.defaults)
            this.filterForm.patchValue({ status: this.defaults.status });
        if ("section" in this.defaults)
            this.filterForm.patchValue({ section: this.defaults.section });

        this.filterForm.valueChanges.subscribe((data) => {
            console.log("FeedbackFilterComponent", data);
            this.onChange.emit(data);
        });
        this.filterForm.updateValueAndValidity();
    }

    get hasStatusFilter(): boolean {
        return this.filters.some((f) => f === "status");
    }

    get hasTypeFilter(): boolean {
        return this.filters.some((f) => f === "section");
    }

    get hasPeriodFilter(): boolean {
        return this.filters.some((f) => f === "period");
    }
}
