import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";

@Component({
    selector: "app-lk-rating",
    templateUrl: "./lk-rating.component.html",
    styleUrls: ["./lk-rating.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkRatingComponent implements OnInit {
    constructor() {}
    @Input() size: "s" | "m" | "l" = "m";
    @Input() mode: "simple" | "compare" = "simple";
    @Input() colorMode: "color" | "primary" = "primary";
    @Input() stepMode: "discreet" | "flow" = "discreet";
    @Input() rateMax?: number;
    @Input() rateMin?: number;
    @Input() rateCurrent?: number;
    @Input() rateAvg?: number;
    @Input() rateAvgMax?: number;
    @Input() rateAvgMin?: number;
    height: number;
    maxWidth: number;

    ngOnInit(): void {
        // set size
        switch (this.size) {
            case "s":
                this.height = 4;
                break;
            case "m":
                this.height = 6;
                break;
            case "l":
                this.height = 8;
                break;
            default:
                this.height = 6;
        }

        // set max width
        switch (this.size) {
            case "s":
                this.maxWidth = 80;
                break;
            case "m":
                this.maxWidth = 120;
                break;
            case "l":
                this.maxWidth = 160;
                break;
            default:
                this.maxWidth = 120;
        }
        if (
            !this.rateMax ||
            !this.rateMin ||
            (this.mode === "compare" &&
                (!this.rateAvgMax || !this.rateAvgMin)) ||
            this.rateMax - this.rateMin < 0.3 ||
            (this.mode === "compare" && this.rateAvgMax - this.rateAvgMin < 0.3)
        )
            this.stepMode = "discreet";

        if (!this.rateAvg) this.mode = "simple";
    }

    isShowMeCurrent(score: number): boolean {
        if (this.stepMode === "flow") return true;
        if (this.mode === "compare") {
            return Math.floor(this.rateCurrent) === score;
        }
        if (this.mode === "simple") {
            return this.rateCurrent >= score;
        }
    }

    isShowMeCompare(score: number): boolean {
        return this.stepMode === "flow" || Math.floor(this.rateAvg) === score;
    }

    get clipCurrent(): string {
        const minPercent = (this.rateMin / 5) * 100;
        const maxPercent = (this.rateMax / 5) * 100;
        return this.stepMode === "flow"
            ? `inset(0% ${100 - maxPercent}% 0% ${minPercent}%)`
            : "inset(0% 0% 0% 0%)";
    }

    get clipCompare(): string {
        const minPercent = (this.rateAvgMin / 5) * 100;
        const maxPercent = (this.rateAvgMax / 5) * 100;
        return this.stepMode === "flow"
            ? `inset(0% ${100 - maxPercent}% 0% ${minPercent}%)`
            : "inset(0% 0% 0% 0%)";
    }
}
