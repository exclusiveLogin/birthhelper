import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ODRER_ACTIONS, Order, OrderGroup, OrderRequest, SlotEntityUtility, StatusRusMap, StatusType} from '@models/order.interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, pluck, switchMap, tap} from 'rxjs/operators';
import {uniq} from '@modules/utils/uniq';
import {RestService} from '@services/rest.service';
import {ContragentSlots, PriceEntitySlot, SlotEntity, TabedSlots, UtilizedFloorOfSlotEntity} from '@models/entity.interface';
import * as moment from 'moment';
import {IImage} from '../../../../../../Dashboard/Editor/components/image/image.component';
import {User} from '@models/user.interface';
import {ImageService} from '@services/image.service';
import {Sections} from '@models/core';
import {SectionType} from '@services/search.service';
import {MetaPhoto} from '@models/map-object.interface';
import {PersonBuilder, PersonDoctorSlot} from '@models/doctor.interface';
import {PlacementBuilder, PlacementSlot} from '@models/placement.interface';
import {CardSlot, ConfiguratorCardBuilder} from '@models/cardbuilder.interface';
import {ToastrService} from 'ngx-toastr';

interface OrderGroupFilters {
    contragentId: number;
    section: SectionType;
    slotEntityKey: string;
    utility: SlotEntityUtility;
    order: Order;
}

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

    filters: OrderGroupFilters = {
        contragentId: null,
        section: null,
        slotEntityKey: null,
        utility: 'other',
        order: null,
    };

    onRepoMode$ = this.repoMode$.pipe(filter(state => !!state));
    onRepoData$ = this.onRepoMode$.pipe(
        filter(_ => !!this.filters?.contragentId),
        switchMap(_ => this.filters.slotEntityKey
            ? this.restService.getSlotsByContragent(this.filters.slotEntityKey, this.filters.contragentId, []).pipe(
                map(data => ({
                    [this.filters.section]: {
                        config: null,
                        tabs: [
                            {
                                title: '',
                                key: this.filters.order.tab_key,
                                floors: [
                                    {
                                        title: '',
                                        utility: this.filters.utility,
                                        key: this.filters.order.floor_key,
                                        list: [...data]
                                    }
                                ],
                            },
                        ],
                        } as ContragentSlots
                    })))
            : this.restService.getSlotListByContragent(this.filters.contragentId)),
        tap(data => {
            for (const section of this.sections) {
                const sectionData = data[section];
                if (sectionData?.tabs?.length) {
                    const floors = (sectionData.tabs as TabedSlots[])
                        .reduce((acc, tab) => ([...acc, ...tab.floors]), [] as UtilizedFloorOfSlotEntity[]);
                    floors.forEach(f => {
                        const newSlots = [];
                        for (const slot of f.list) {
                            newSlots.push(this.generateCartSlot(slot, f.utility));
                        }
                        f.list = newSlots;
                    });
                }
            }
        }),
    );

    _orderGroup: OrderGroup;
    @Input() set orderGroup(value) {
        this._orderGroup = value;
        this.filters = {
            order: null,
            slotEntityKey: null,
            utility: 'other',
            contragentId: this.filters.contragentId,
            section: null,
        };

        for (const order of this._orderGroup.orders) {
            this.restService.getEntity(order.slot_entity_key, order.slot_entity_id).pipe(
                tap((slot: PriceEntitySlot) => order.setSlot(slot)),
            ).toPromise();
        }

        this.updater$.next(null);
    }

    @Input()
    set contragentId(value: number) {
        this.filters.contragentId = value;
    }

    @Output() refresh = new EventEmitter<null>();

    constructor(
        private cdr: ChangeDetectorRef,
        private restService: RestService,
        private imageService: ImageService,
        private toastr: ToastrService,
    ) {
    }

    loading$ = new BehaviorSubject<string>(null);
    isLoading = this.loading$.pipe(
        tap(state => (state !== null)
            ? this.toastr.info(state.length ? state : 'Пожалуйста ожидайте', 'Выполняется действие')
            : this.toastr.clear())
    );
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
        this.isLoading.subscribe();
    }

    generateCartSlot(data: SlotEntity, type: SlotEntityUtility): PersonDoctorSlot | PlacementSlot | CardSlot {
        let _: any;
        _ = type === 'person' ? PersonBuilder.serialize(data as PersonDoctorSlot) : _;
        _ = type === 'placement' ? PlacementBuilder.serialize(data as PlacementSlot) : _;
        _ = type === 'other' ? ConfiguratorCardBuilder.serialize(data as CardSlot) : _;
        return _;
    }

    orderAction(order: Order, action: 'reject' | 'resolve' | 'edit' | 'remove'): void {
        if (!confirm('вы уверены что хотите произвести это действие?')) { return; }
        this.filters.order = order;
        this.loading$.next('');
        if (action === 'reject') { this.rejectOrder(order); }
        if (action === 'resolve') { this.resolveOrder(order); }
        if (action === 'remove') { this.removeOrder(order); }
        if (action === 'edit') { this.editOrder(order); }
    }

    rejectOrder(order: Order): void {
        const request: OrderRequest = {
            action: ODRER_ACTIONS.REJECT,
            id: order.id,
        };

        this.restService.requestOrdersPost(request).toPromise()
            .then(() => this.refresh.next(null))
            .finally(() => this.loading$.next(null));
    }

    resolveOrder(order: Order): void {
        const request: OrderRequest = {
            action: ODRER_ACTIONS.RESOLVE,
            id: order.id,
        };

        this.restService.requestOrdersPost(request).toPromise()
            .then(() => this.refresh.next(null))
            .finally(() => this.loading$.next(null));
    }

    removeOrder(order: Order): void {
        const request: OrderRequest = {
            action: ODRER_ACTIONS.REMOVE,
            id: order.id,
        };

        this.restService.requestOrdersPost(request).toPromise()
            .then(() => this.refresh.next(null))
            .finally(() => this.loading$.next(null));
    }

    editOrder(order: Order): void {
        this.filters.slotEntityKey = order.slot_entity_key;
        this.filters.section = order.section_key;
        this.repoMode$.next(true);
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

    getStatusTitleForOrder(order: Order): string {
        return StatusRusMap[order.status] ?? '---';
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

    getSlotsBySection(section: string): Observable<ContragentSlots> {
        const _ = section as SectionType;
        return this.onRepoData$.pipe(
            pluck(_),
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
    gotoCartMode(): void {
        this.repoMode$.next(false);
    }

}
