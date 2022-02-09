import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Order, OrderGroup, StatusRusMap, StatusType} from '@models/order.interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {uniq} from '@modules/utils/uniq';
import {RestService} from '@services/rest.service';
import {PriceEntitySlot} from '@models/entity.interface';
import * as moment from 'moment';
import {IImage} from '../../../../../../Dashboard/Editor/components/image/image.component';
import {User} from '@models/user.interface';
import {ImageService} from '@services/image.service';
import {Sections} from '@models/core';
import {SectionType} from '@services/search.service';
import {MetaPhoto} from '@models/map-object.interface';

@Component({
    selector: 'app-order-group',
    templateUrl: './order-group.component.html',
    styleUrls: ['./order-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderGroupComponent implements OnInit {

    sectionsDict = Sections;
    sections = Object.keys(this.sectionsDict);
    repoMode$ = new BehaviorSubject(false);

    filters: {
        contragentId: number,
        section: SectionType,
        slotEntityKey: string,
    } = {
        contragentId: null,
        section: null,
        slotEntityKey: null,
    };

    onRepoMode$ = this.repoMode$.pipe(filter(state => !!state));
    onRepoData$ = this.onRepoMode$.pipe(
        filter(_ => !!this.filters?.contragentId),
        // switchMap(_ => this.filters.slotEntityKey
        //     // ? this.restService.getSlotsByContragent(this.filters.slotEntityKey, this.filters.contragentId, []).pipe(
        //     //     map(data => ({[this.filters.section]: {
        //     //             title: Sections[this.filters.section],
        //     //             key: this.filters.section,
        //     //             list: data,
        //     //         }} as SectionedContragentSlots)))
        //     // : this.restService.getSlotListByContragent(this.filters.contragentId)),
        tap(_ => console.log('onRepoData$', _)),
    );

    _orderGroup: OrderGroup;
    @Input() set orderGroup(value) {
        this._orderGroup = value;
        for (const order of this._orderGroup.orders) {
            this.restService.getEntity(order.slot_entity_key, order.slot_entity_id).pipe(
                tap((slot: PriceEntitySlot) => order.setSlot(slot)),
                tap(_ => this.updater$.next(null)),
                tap(_ => this.cdr.markForCheck()),
            ).toPromise();
        }
        this.updater$.next(null);
    }

    @Input()
    set contragentId(value: number) {
        this.filters.contragentId = value;
    }

    constructor(
        private cdr: ChangeDetectorRef,
        private restService: RestService,
        private imageService: ImageService,
    ) {
    }

    updater$ = new BehaviorSubject<null>(null);
    data$ = this.updater$.pipe(map(_ => this._orderGroup));
    user$: Observable<User> = this.data$.pipe(map(data => data.user));
    wrapMode = false;

    userPhotoData$ = this.user$.pipe(
        filter(user => !!user.photo_id),
        map(user => user.photo_id),
        switchMap(userPhotoId => this.restService.getEntity('ent_images', userPhotoId)),
        map(image => this.imageService.getImage$(image as IImage)),
    );
    userPhoto$ = this.userPhotoData$.pipe(map(d => d[0]));
    userPhotoSignal$ = this.userPhotoData$.pipe(map(d => d[1]));

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

    getOrdersBySection(section: string): Observable<Order[]> {
        const _ = section as SectionType;
        return this.data$.pipe(
            map(orders => orders.orders.filter(o => o.section_key === _)),
        );
    }

    getPhoto(photo: MetaPhoto) {
        return this.imageService.getImage$(photo);
    }

    selectSlot(): void {
        this.repoMode$.next(false);
    }

    addSlotIntoOrders(): void {
        this.repoMode$.next(true);
    }

}
