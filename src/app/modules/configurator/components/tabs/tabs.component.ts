import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { TabRxInput } from "app/modules/configurator/configurator.model";
import { Observable, combineLatest } from "rxjs";
import { delay, map, switchMap, tap } from "rxjs/operators";
import { OrderService, StatusValidation } from "app/services/order.service";
import { ConfiguratorService } from "../../configurator.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-configurator-tabs",
    templateUrl: "./tabs.component.html",
    styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements OnInit, AfterViewInit {
    @Input() tabs$: Observable<TabRxInput[]>;
    @Output() currentTab = new EventEmitter<string>();

    @ViewChild('tabsScroll', { static: false }) tabsScroll: ElementRef<HTMLDivElement>;
    showLeftArrow = false;
    showRightArrow = false;
    activeTab: string;

    constructor(
        private orderService: OrderService,
        private configuratorService: ConfiguratorService,
        private router: Router
    ) {}

    price$: Observable<number> = combineLatest([
        this.configuratorService.onContragent$,
        this.configuratorService.currentSectionKey$,
    ]).pipe(
        switchMap(([ctg, section]) => {
            return this.orderService.getPriceByContragent(
                ctg.contragent,
                section
            );
        })
    );

    onValidationState$ =
        this.configuratorService.onValidationStateByContragentChanged$;

    async gotoCart() {
        await this.router.navigate(["/system", "cart"]);
    }

    selectTab(key: string): void {
        this.activeTab = key;
        this.currentTab.emit(key);
    }

    ngOnInit(): void {
        this.tabs$ = this.tabs$
            ? this.tabs$.pipe(
                  delay(100),
                  tap((tabs) =>
                      tabs[0]?.key ? this.selectTab(tabs[0]?.key) : null
                  )
              )
            : null;
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.updateArrows(), 200);
        if (this.tabsScroll) {
            this.tabsScroll.nativeElement.addEventListener('scroll', () => this.updateArrows());
        }
        window.addEventListener('resize', () => this.updateArrows());
    }

    updateArrows(): void {
        if (!this.tabsScroll) return;
        const el = this.tabsScroll.nativeElement;
        this.showLeftArrow = el.scrollLeft > 1;
        this.showRightArrow = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
    }

    scrollTabs(direction: 'left' | 'right'): void {
        if (!this.tabsScroll) return;
        const el = this.tabsScroll.nativeElement;
        const scrollAmount = el.clientWidth * 0.7;
        if (direction === 'left') {
            el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        setTimeout(() => this.updateArrows(), 350);
    }

    isActiveTab(key: string): boolean {
        return this.activeTab === key;
    }

    getValidationByTabKey(tabKey: string): Observable<StatusValidation> {
        return this.configuratorService
            .getValidationStateTabByKey(tabKey)
            .pipe(map((item) => item?.status));
    }

    getTabSelectedCounts(tabKey: string): Observable<number> {
        return this.configuratorService
            .getValidationStateTabByKey(tabKey)
            .pipe(map((item) => item?.selected ?? 0));
    }
}
