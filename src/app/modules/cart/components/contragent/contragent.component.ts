import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {OrderService, ValidationTreeContragent} from 'app/services/order.service';
import {RestService} from 'app/services/rest.service';
import {Clinic, IClinicMini, IClinicSrc} from 'app/models/clinic.interface';
import {map} from 'rxjs/operators';
import {Contragent} from 'app/models/contragent.interface';
import {SectionType} from 'app/services/search.service';
import {Router} from '@angular/router';
import {ConfiguratorService} from 'app/modules/configurator/configurator.service';
import {Sections} from 'app/models/core';
import {Order} from 'app/models/order.interface';

interface Titled {
    title: string;
    key: string;
}

@Component({
    selector: 'app-contragent',
    templateUrl: './contragent.component.html',
    styleUrls: ['./contragent.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContragentComponent implements OnInit {

    _validationTreeByContragent: ValidationTreeContragent;
    @Input() set validationTreeByContragent(value: ValidationTreeContragent) {
        this._validationTreeByContragent = value;
        this.sections = value.sections.map(sc => ({key: sc, title: Sections[sc]}));
        value.sections.forEach((s, idx) =>
            this.sectionTabs[s] = value.sectionConfigs[idx].tabs.map(t => ({key: t.key, title: t.title})));
    }
    @Input() show = false;
    contragent$: Observable<Contragent | IClinicMini>;
    shown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.show);
    sections: { key: SectionType, title: string }[] = [];
    sectionTabs: { [sectionKey in SectionType]?: Titled[] } = {};

    constructor(
        private ordersService: OrderService,
        private restService: RestService,
        private router: Router,
        private configurator: ConfiguratorService,
    ) {
    }

    getOrders(section: SectionType, tabKey: string): Order[] {
        return this._validationTreeByContragent._orders.filter(o => (o.section_key === section && o.tab_key === tabKey));
    }
    async gotoConfigurator() {
        const contragentData = this.ordersService.contragentHashMap[this._validationTreeByContragent.contragentHash];
        if (!this._validationTreeByContragent) { return; }
        await this.router.navigate(['/system', 'configurator', this._validationTreeByContragent.sections[0], contragentData.id]);
    }

    ngOnInit(): void {
        if (!this._validationTreeByContragent) { return; }

        this.shown$.next(this.show);

        const contragentData = this.ordersService.contragentHashMap[this._validationTreeByContragent.contragentHash];
        this.contragent$ = contragentData
            ? this.restService.getEntity<IClinicSrc>(contragentData.entKey, contragentData.id)
                .pipe(map(c => Clinic.createClinicMini(c)))
            : of(null);
    }

    getContextContragent(sectionKey: SectionType) {
        if (sectionKey === 'clinic') {
            return this.contragent$ as unknown as Observable<IClinicMini>;
        }
        return this.contragent$ as Observable<Contragent>;
    }

    wrapOrdersBlock(): void {
        this.shown$.next(true);
    }

    unWrapOrdersBlock(): void {
        this.shown$.next(false);
    }
}
