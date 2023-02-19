import { Component, OnInit } from "@angular/core";
import { LkService } from "@services/lk.service";

@Component({
    selector: "app-lk-feedback",
    templateUrl: "./lk-feedback.component.html",
    styleUrls: ["./lk-feedback.component.scss"],
})
export class LkFeedbackComponent {
    selectedCTG$ = this.lkService.selectedContragents$;

    constructor(private lkService: LkService) {}
}
