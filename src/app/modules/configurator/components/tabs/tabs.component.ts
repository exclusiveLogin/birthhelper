import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TabRxInput} from 'app/modules/configurator/configurator.model';
import {Observable, combineLatest} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {OrderService, StatusValidation} from 'app/services/order.service';
import {ConfiguratorService} from '../../configurator.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-configurator-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    @Input() tabs$: Observable<TabRxInput[]>;
    @Output() currentTab = new EventEmitter<string>();

    activeTab: string;

    constructor(
        private orderService: OrderService,
        private configuratorService: ConfiguratorService,
        private router: Router,
    ) {
    }

    price$: Observable<number> = combineLatest([
        this.configuratorService.currentContragentID$,
        this.configuratorService.currentSectionKey$,
    ]).pipe(
        switchMap(([id, section]) => {
            return this.orderService.getPriceByContragent(id, section);
        }),
    );

    onValidationState$ = this.configuratorService.onValidationStateByContragentChanged$;


    async gotoCart() {
        await this.router.navigate(['/system', 'cart']);
    }

    selectTab(key: string): void {
        this.activeTab = key;
        this.currentTab.emit(key);
    }

    ngOnInit(): void {
        this.tabs$ = this.tabs$
            ? this.tabs$.pipe(
                tap(tabs => tabs[0]?.key
                    ? this.selectTab(tabs[0]?.key)
                    : null
                ))
            : null;
    }

    isActiveTab(key: string): boolean {
        return this.activeTab === key;
    }

    getValidationByTabKey(tabKey: string): Observable<StatusValidation> {
        return this.configuratorService.getValidationStateTabByKey(tabKey).pipe(map(item => item?.status));
    }

    getTabSelectedCounts(tabKey: string): Observable<number> {
        return this.configuratorService.getValidationStateTabByKey(tabKey).pipe(map(item => item?.selected ?? 0));
    }

}
