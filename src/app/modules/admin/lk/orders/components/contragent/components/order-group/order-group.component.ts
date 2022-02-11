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
import {ConfiguratorConfigSrc, Restrictor, SelectionOrderSlot} from '@modules/configurator/configurator.model';
import {CTG} from '@services/lk.service';

interface OrderGroupFilters {
    contragentId: number;
    section: SectionType;
    slotEntityKey: string;
    utility: SlotEntityUtility;
    order: Order;
    restrictors: Restrictor[];
}

@Component({
    selector: 'app-order-group',
    templateUrl: './order-group.component.html',
    styleUrls: ['./order-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderGroupComponent implements OnInit {

    ctg: CTG;
    sectionsDict = Sections;
    sections = Object.keys(this.sectionsDict) as SectionType[];
    repoMode$ = new BehaviorSubject(false);
    configRepo: { [section in SectionType ]?: ConfiguratorConfigSrc} = {};

    filters: OrderGroupFilters = {
        contragentId: null,
        section: null,
        slotEntityKey: null,
        utility: 'other',
        order: null,
        restrictors: null,
    };

    onRepoMode$ = this.repoMode$.pipe(filter(state => !!state));
    onRepoData$ = this.onRepoMode$.pipe(
        filter(_ => !!this.filters?.contragentId),
        switchMap(_ => this.filters.slotEntityKey
            ? this.restService.getSlotsByContragent(
                this.filters.slotEntityKey,
                this.filters.contragentId,
                []
            ).pipe(
                map(data => data
                    .filter(ent => this.filters?.restrictors?.length
                        ? this.filters.restrictors.every(r => ent._entity[r.key] === r.value)
                        : true)),
                map(data => ({
                    [this.filters.section]: {
                        tabs: [
                            {
                                title: '',
                                key: this.filters?.order?.tab_key,
                                floors: [
                                    {
                                        title: '',
                                        utility: this.filters?.order?.utility,
                                        key: this.filters?.order?.floor_key,
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
            restrictors: null,
        };

        for (const order of this._orderGroup.orders) {
            this.restService.getEntity(order.slot_entity_key, order.slot_entity_id).pipe(
                tap((slot: PriceEntitySlot) => order.setSlot(slot)),
                tap(_ => this.updater$.next(null)),
            ).toPromise();
        }

        this.updater$.next(null);
    }

    @Input()
    set contragent(value: CTG) {
        this.filters.contragentId = value.entId;
        this.ctg = value;
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

    getOrdersBySelection(section: SectionType, tabKey: string, floorKey: string): Observable<Order[]> {
        return this.data$.pipe(
            map(data => data.orders.filter(order =>
                order.section_key === section && order.tab_key === tabKey && order.floor_key === floorKey)));
    }

    getConfigBySection(section: SectionType): Observable<ConfiguratorConfigSrc> {
        return this.restService.getConfiguratorSettings(section).pipe(
            tap(config => this.configRepo[section] = config));
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
        const config = order.section_key && this.configRepo[order.section_key];
        if (!config) { return; }
        const configFloor = config.tabs.find(t => t.key === order.tab_key)?.floors.find(f => f.key === order.floor_key);
        const restrictors = [...configFloor.consumerKeys
            .map(ck => config.consumers.find(c => c.key === ck))
            .filter(_ => !!_)
            .map(consumer => consumer.restrictors)
            .reduce((acc, r) => [...acc, ...r])] ?? [] as Array<Restrictor>;
        this.filters.restrictors = restrictors;
        this.filters.slotEntityKey = order.slot_entity_key;
        this.filters.section = order.section_key;
        this.loading$.next(null);
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

    selectSlot( sectionKey: SectionType, tab: TabedSlots, floor: UtilizedFloorOfSlotEntity, slot: SlotEntity ): void {
        this.loading$.next('');
        const selection: SelectionOrderSlot = {
            sectionKey,
            tabKey: tab.key,
            floorKey: floor.key,
            entKey: this.filters?.slotEntityKey ?? slot?.__entity_key,
            entId: slot.id,
            contragent_entity_key: this.ctg.entKey,
            contragent_entity_id: this.ctg.entId,
            status: 'waiting',
            group_token: this.filters?.order?.group_token ?? this._orderGroup.groupMode === 'order' ? this._orderGroup.group_id : null,
            utility: floor.utility,
        };

        console.log('selectSlot: ', selection);
        this.restService.createOrder(selection).toPromise()
            .then(() => this.refresh.next(null))
            .finally(() => this.loading$.next(null));
        this.repoMode$.next(false);
        if (this.filters.order) {
            this.removeOrder(this.filters.order);
        }
    }

    addSlotIntoOrders(): void {
        this.repoMode$.next(true);
    }
    gotoCartMode(): void {
        this.filters.restrictors = null;
        this.filters.slotEntityKey = null;
        this.filters.section = null;
        this.filters.order = null;
        this.repoMode$.next(false);
    }

}
