import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TabRxInput} from 'app/modules/configurator/configurator.model';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {OrderService} from '../../../../services/order.service';
import {ConfiguratorService} from '../../configurator.service';

@Component({
    selector: 'app-configurator-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    @Input() tabs$: Observable<TabRxInput[]>;
    @Output() currentTab = new EventEmitter<string>();

    activeTab: string;

    price$: Observable<number>;

    constructor(
        private orderService: OrderService,
        private configuratorService: ConfiguratorService,
    ) {}

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

        this.configuratorService.currentContragentID$
            .subscribe(id => this.price$ = this.orderService.getPriceBuContragent(id));
    }

    isActiveTab(key: string): boolean {
        return this.activeTab === key;
    }

}
