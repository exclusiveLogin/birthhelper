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

@Component({
    selector: 'app-contragent',
    templateUrl: './contragent.component.html',
    styleUrls: ['./contragent.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ContragentComponent implements OnInit {

    @Input() validationTreeByContragent: ValidationTreeContragent;
    @Input() show = false;
    contragent$: Observable<Contragent | IClinicMini>;
    shown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.show);

    constructor(
        private ordersService: OrderService,
        private restService: RestService,
        private router: Router,
        private configurator: ConfiguratorService,
    ) {
    }

    async gotoConfigurator() {
        const contragentData = this.ordersService.contragentHashMap[this.validationTreeByContragent.contragentHash];
        if (!this.validationTreeByContragent) { return; }
        await this.router.navigate(['/system', 'configurator', this.validationTreeByContragent.section, contragentData.id]);
        this.configurator.selectFirstTab();
    }

    ngOnInit(): void {
        if (!this.validationTreeByContragent) { return; }

        this.shown$.next(this.show);

        const contragentData = this.ordersService.contragentHashMap[this.validationTreeByContragent.contragentHash];
        this.contragent$ = contragentData
            ? this.restService.getEntity<IClinicSrc>(contragentData.entKey, contragentData.id)
                .pipe(map(c => Clinic.createClinicMini(c)))
            : of(null);
    }

    getContextContragent(sectionKey: SectionType) {
        if (this.validationTreeByContragent.section === 'clinic') {
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
