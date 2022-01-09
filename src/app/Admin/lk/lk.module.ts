import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LkComponent} from './lk.component';
import {LkRoutingModule} from './lk.routing/lk.routing.module';
import { OrdersComponent } from './orders/orders.component';
import {MenuModule} from '../../modules/menu/menu.module';

@NgModule({
    declarations: [
        LkComponent,
        OrdersComponent,
    ],
    imports: [
        CommonModule,
        LkRoutingModule,
        MenuModule,
    ]
})
export class LkModule {
}
