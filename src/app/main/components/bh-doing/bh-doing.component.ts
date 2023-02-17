import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnInit,
} from "@angular/core";

@Component({
    selector: "app-bh-doing",
    templateUrl: "./bh-doing.component.html",
    styleUrls: ["./bh-doing.component.scss"],
})
export class BhDoingComponent implements OnInit {
    currentTab = 1;
    autoStart = true;
    width = 0;

    @HostListener("window:resize")
    refreshContainer() {
        this.width =
            this.el.nativeElement.querySelector(".tab_container").clientWidth;
    }

    constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

    setTab(idx: number): void {
        this.currentTab = idx;

        this.cdr.markForCheck();
    }

    ngOnInit(): void {
        this.width =
            this.el.nativeElement.querySelector(".tab_container").clientWidth;
    }
}
