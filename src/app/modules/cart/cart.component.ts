import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OrderService, ValidationTreeContragent} from '../../services/order.service';
import {map, take, tap} from 'rxjs/operators';
import {Order} from 'app/models/order.interface';
import {summatorPipe} from 'app/modules/utils/price-summator';
import {ConfiguratorService} from 'app/modules/configurator/configurator.service';
import {Observable} from 'rxjs';
import {DialogService} from '../dialog/dialog.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {requiredOneOfList} from '../../validators/atOneOfListRequiredValidator';
import {SelectionOrderSlot} from '../configurator/configurator.model';
import {AuthService} from '../auth-module/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {

    @ViewChild('tpl_contacts', { static: true }) tpl_contacts: TemplateRef<any>;
    @ViewChild('tpl_suggestion', { static: true }) tpl_suggestion: TemplateRef<any>;

    validationTree$ = this.orderService.onValidationTreeCompleted$.pipe(
        tap(c => console.log(c)),
    );

    hasInvalidTree$ = this.validationTree$.pipe(
        map(tree => tree.filter(t => t.isInvalid)),
        map(tree => !!tree.length),
    );

    hasPendingOrders$ = this.validationTree$.pipe(
        map(tree => tree.reduce((acc, cur) => [...acc, ...cur._orders], [] as Order[])),
        map(orders => orders.filter(o => o.status === 'pending')),
        map(tree => !!tree.length),
    );

    totalPrice$: Observable<number> = this.validationTree$.pipe(
        map(tree => tree.reduce((keys, cur) => [...keys, ...cur._orders], [] as Order[])),
        map(orders => orders.map(o => o?.slot?.price ?? 0)),
        map((prices: number[]) => prices.map(price => +price)),
        map((prices: number[]) => prices.filter(price => !!price && !isNaN(price))),
        summatorPipe,
    );

    totalPriceValid$: Observable<number> = this.validationTree$.pipe(
        map(tree => tree.filter(t => !t.isInvalid)),
        map(tree => tree.reduce((keys, cur) => [...keys, ...cur._orders], [] as Order[])),
        map(orders => orders.map(o => o?.slot?.price ?? 0)),
        map((prices: number[]) => prices.map(price => +price)),
        map((prices: number[]) => prices.filter(price => !!price && !isNaN(price))),
        summatorPipe,
    );

    formGroup = new FormGroup({
        phone: new FormControl('', [Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)]),
        email: new FormControl('', [Validators.email]),
        skype: new FormControl(),
        ch_phone: new FormControl(),
        ch_viber: new FormControl(),
        ch_whatsapp: new FormControl(),
        ch_telegram: new FormControl(),
        ch_email: new FormControl(),
        ch_skype: new FormControl(),
    }, [requiredOneOfList(['phone', 'email', 'skype'])]);

    constructor(
        private orderService: OrderService,
        private configurator: ConfiguratorService,
        private dialogService: DialogService,
        private authService: AuthService,
        private router: Router,
        ) {}

    ngOnInit(): void {
    }

    trackIt(idx: number, vt: ValidationTreeContragent): string {
        return vt.contragentHash;
    }

    clearCart(): void {
        const p = confirm('Вы действительно хотите отчистить корзину?');
        if (!p) { return; }
        this.configurator.clearAllSelections();
        this.orderService.clearCart();
    }
    attemptSubmitCart(): void {
        this.authService.onUserAccess$.pipe(
            take(1),
        ).subscribe(userMode => userMode ? this.openDialogContacts() : this.openDialogSuggestion());
    }

    openDialogSuggestion(): void {
        this.dialogService.showDialogByTemplate(this.tpl_suggestion, {data: {hw: ''}, mode: 'dialog'});
    }
    openDialogContacts(): void {
        this.authService.user$.pipe(take(1))
            .subscribe(user => {
                this.formGroup.setValue({
                    phone: user.phone,
                    email: user.email,
                    skype: user.skype,
                    ch_phone: user.ch_phone,
                    ch_viber: user.ch_viber,
                    ch_whatsapp: user.ch_whatsapp,
                    ch_telegram: user.ch_telegram,
                    ch_email: user.ch_email,
                    ch_skype: user.ch_skype,
                });
                this.dialogService.showDialogByTemplate(this.tpl_contacts, {data: {hw: ''}, mode: 'dialog'});
            });
    }
    closeDialog(ev: MouseEvent): void {
        ev.preventDefault();
        this.dialogService.closeOpenedDialog('main_app_dialog');
    }
    submitDialog(ev: MouseEvent): void {
        ev.preventDefault();
        this.dialogService.closeOpenedDialog('main_app_dialog');
        console.log('Form : ', this.formGroup.value);
        const payload: SelectionOrderSlot = {
            contacts: this.formGroup.value,
        };
        this.orderService.submitCart(payload);
    }
    gotoRegistration(): void {
        this.dialogService.closeOpenedDialog('main_app_dialog');
        this.router.navigate(['/auth']).then();
    }
}
