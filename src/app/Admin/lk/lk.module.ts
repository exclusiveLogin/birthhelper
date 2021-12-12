import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LkComponent} from './lk.component';
import {LkRoutingModule} from './lk.routing/lk.routing.module';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
    declarations: [
        LkComponent,
        OrdersComponent
    ],
    imports: [
        CommonModule,
        LkRoutingModule,
    ]
})
export class LkModule {
}
