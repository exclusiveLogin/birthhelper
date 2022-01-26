import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LkComponent} from './lk.component';
import {LkRoutingModule} from './lk.routing/lk.routing.module';
import { OrdersComponent } from './orders/orders.component';
import {MenuModule} from '../../modules/menu/menu.module';
import { SettingsComponent } from './settings/settings.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        LkComponent,
        OrdersComponent,
        SettingsComponent,
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
