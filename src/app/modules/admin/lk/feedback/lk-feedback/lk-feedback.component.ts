import { Component, OnInit } from "@angular/core";
import { LkService } from "@services/lk.service";
import { AuthService } from "@modules/auth-module/auth.service";

@Component({
    selector: "app-lk-feedback",
    templateUrl: "./lk-feedback.component.html",
    styleUrls: ["./lk-feedback.component.scss"],
})
export class LkFeedbackComponent {
    selectedCTG$ = this.lkService.selectedContragents$;
    user$ = this.authService.user$;

    constructor(
        private lkService: LkService,
        private authService: AuthService
    ) {}
}
