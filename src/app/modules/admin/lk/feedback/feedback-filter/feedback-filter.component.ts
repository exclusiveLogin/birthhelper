import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { LkService } from "@services/lk.service";

@Component({
    selector: "app-feedback-filter",
    templateUrl: "./feedback-filter.component.html",
    styleUrls: ["./feedback-filter.component.scss"],
})
export class FeedbackFilterComponent implements OnInit {
    constructor(private lkService: LkService) {}

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
}
