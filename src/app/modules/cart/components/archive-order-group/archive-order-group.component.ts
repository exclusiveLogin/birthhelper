import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Order, OrderGroup, StatusRusMap, StatusType} from '@models/order.interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import * as moment from 'moment';
import {Sections} from '@models/core';
import {SectionType} from '@services/search.service';
import {ConfiguratorConfigSrc} from '@modules/configurator/configurator.model';
import {PriceEntitySlot} from '@models/entity.interface';
import {RestService} from '@services/rest.service';
import {MetaPhoto} from '@models/map-object.interface';
import {ImageService} from '@services/image.service';
import {uniq} from '@modules/utils/uniq';

@Component({
    selector: 'app-archive-order-group',
    templateUrl: './archive-order-group.component.html',
    styleUrls: ['./archive-order-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveOrderGroupComponent implements OnInit {

    _orderGroup: OrderGroup;
    @Input() set orderGroup(value) {
        this._orderGroup = value;
        for (const order of this._orderGroup.orders) {
            this.restService.getEntity(order.slot_entity_key, order.slot_entity_id).pipe(
                tap((slot: PriceEntitySlot) => order.setSlot(slot)),
                tap(_ => this.updater$.next(null)),
            ).toPromise();
        }

        this.updater$.next(null);
    }

    updater$ = new BehaviorSubject<null>(null);
    data$ = this.updater$.pipe(map(_ => this._orderGroup));
    orders$ = this.data$.pipe(map(group => group.orders));

    wrapMode = false;

    sectionsDict = Sections;
    sections = Object.keys(this.sectionsDict) as SectionType[];
    repoMode$ = new BehaviorSubject(false);
    configRepo: { [section in SectionType ]?: ConfiguratorConfigSrc} = {};

    constructor(
        private restService: RestService,
        private imageService: ImageService,
    ) {
    }

    ngOnInit(): void {
    }

    wrap() {
        this.wrapMode = true;
    }

    unwrap() {
        this.wrapMode = false;
    }

    getGroupPrice(): number {
        const prices: number[] = this._orderGroup.orders
            .map(o => o?.slot?.price ?? 0)
            .map(price => +price)
            .filter(price => !!price && !isNaN(price));

        return prices.reduce((acc, cur) => cur + acc, 0);
    }

    getLastDate(): string {
        const orders = this._orderGroup.orders;
        if (orders?.length) {
            const mods = orders.map(o => moment(o.datetime_update));
            const max = moment.max(mods);
            return max.format('DD-MM-YYYY hh:mm:ss');
        }
        return null;
    }

    getConfigBySection(section: SectionType): Observable<ConfiguratorConfigSrc> {
        return this.restService.getConfiguratorSettings(section).pipe(
            tap(config => this.configRepo[section] = config));
    }

    getOrdersBySelection(section: SectionType, tabKey: string, floorKey: string): Observable<Order[]> {
        return this.data$.pipe(
            map(data => data.orders.filter(order =>
                order.section_key === section && order.tab_key === tabKey && order.floor_key === floorKey)));
    }
    getPhoto(photo: MetaPhoto) {
        return this.imageService.getImage$(photo);
    }

    getStatusTitleForOrder(order: Order): string {
        return StatusRusMap[order.status] ?? '---';
    }

    getStatusTitle(): string {
        const statuses: StatusType[] = uniq(this._orderGroup.orders.map(o => o.status)) as StatusType[];
        let status: StatusType = 'pending';
        status = statuses.some(s => s === 'waiting') ? 'waiting' : status;
        status = statuses.every(s => s === 'completed') ? 'completed' : status;
        return StatusRusMap[status] ?? '---';
    }

}
