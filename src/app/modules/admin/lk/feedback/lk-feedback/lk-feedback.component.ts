import { Component, OnInit } from "@angular/core";
import { LkService } from "@services/lk.service";
import { AuthService } from "@modules/auth-module/auth.service";
import { Vote } from "@modules/feedback/models";

@Component({
    selector: "app-lk-feedback",
    templateUrl: "./lk-feedback.component.html",
    styleUrls: ["./lk-feedback.component.scss"],
})
export class LkFeedbackComponent {
    selectedCTG$ = this.lkService.selectedContragents$;
    user$ = this.authService.user$;

    votes: Partial<Vote>[] = [
        { rate: 3, title: "test 1", id: 1 },
        { rate: 2, title: "test 2", id: 2 },
        { rate: 4, title: "некоторый длинный текст", id: 3 },
        { rate: 3, title: "test 4", id: 4 },
        { rate: 4, title: "test 5", id: 5 },
        { rate: 5, title: "test 6", id: 6 },
        { rate: 3, title: "test 7", id: 7 },
        { rate: 4, title: "test 8", id: 8 },
    ];

    constructor(
        private lkService: LkService,
        private authService: AuthService
    ) {}
}
