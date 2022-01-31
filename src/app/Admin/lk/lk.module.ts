import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LkComponent} from './lk.component';
import {LkRoutingModule} from './lk.routing/lk.routing.module';
import { OrdersComponent } from './orders/orders.component';
import {MenuModule} from '../../modules/menu/menu.module';
import { SettingsComponent } from './settings/settings.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ContragentComponent } from './orders/components/contragent/contragent.component';
import { OrderGroupComponent } from './orders/components/contragent/components/order-group/order-group.component';
import { ContragentHeaderComponent } from './orders/components/contragent/components/contragent-header/contragent-header.component';

@NgModule({
    declarations: [
        LkComponent,
        OrdersComponent,
        SettingsComponent,
        ContragentComponent,
        OrderGroupComponent,
        ContragentHeaderComponent,
    ],
    imports: [
        CommonModule,
        LkRoutingModule,
        MenuModule,
        ReactiveFormsModule,
    ]
})
export class LkModule {
}
