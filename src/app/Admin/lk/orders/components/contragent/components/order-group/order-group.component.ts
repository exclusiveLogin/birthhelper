import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {OrderGroup, StatusRusMap, StatusType} from '@models/order.interface';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {uniq} from '../../../../../../../modules/utils/uniq';
import {RestService} from '@services/rest.service';
import {PriceEntitySlot} from '@models/entity.interface';

@Component({
    selector: 'app-order-group',
    templateUrl: './order-group.component.html',
    styleUrls: ['./order-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderGroupComponent implements OnInit {

    _orderGroup: OrderGroup;
    @Input() set orderGroup(value) {
        this._orderGroup = value;
        for (const order of this._orderGroup.orders) {
            this.restService.getEntity(order.slot_entity_key, order.slot_entity_id).pipe(
                tap((slot: PriceEntitySlot) => order.setSlot(slot)),
            ).toPromise();
        }
    }

    constructor(
        private cdr: ChangeDetectorRef,
        private restService: RestService,
    ) {
    }

    data$: Observable<OrderGroup>;
    updater$ = new BehaviorSubject<null>(null);
    wrapMode = false;

    ngOnInit(): void {
        this.data$ = this.updater$.pipe(map(_ => this._orderGroup));
    }

    wrap() {
        this.wrapMode = true;
        this.cdr.markForCheck();
    }

    unwrap() {
        this.wrapMode = false;
        this.cdr.markForCheck();
    }

    getStatusTitle(): string {
        const statuses: StatusType[] = uniq(this._orderGroup.orders.map(o => o.status)) as StatusType[];
        let status: StatusType = 'pending';
        status = statuses.some(s => s === 'waiting') ? 'waiting' : status;
        status = statuses.every(s => s === 'completed') ? 'completed' : status;
        return StatusRusMap[status] ?? '---';
    }

    getGroupPrice(): number {
        const prices: number[] = this._orderGroup.orders.map(o => o.slot.price ?? 0);
        return prices.reduce((acc, cur) => cur + acc, 0);
    }

}
