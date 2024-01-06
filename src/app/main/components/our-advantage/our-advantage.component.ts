import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import {
    accordionWrapperAnimation,
    contentAnimation,
} from "../../animations/base-animations";

@Component({
    selector: "app-our-advantage",
    templateUrl: "./our-advantage.component.html",
    styleUrls: ["./our-advantage.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [accordionWrapperAnimation, contentAnimation],
})
export class OurAdvantageComponent implements OnInit {
    openKeys: string[] = [];
    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {}

    toggleBlockByKey(key: string): void {
        const exist = this.openKeys.indexOf(key);
        // eslint-disable-next-line no-bitwise
        if (~exist) {
            this.openKeys.splice(exist, 1);
        } else {
            this.openKeys.push(key);
        }
        this.cdr.markForCheck();
    }

    isOpened(key: string): boolean {
        return this.openKeys.includes(key);
    }
}
