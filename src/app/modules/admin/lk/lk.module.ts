import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LkRoutingModule } from "./lk.routing.module";
import { OrdersComponent } from "./orders/orders.component";
import { MenuModule } from "../../menu/menu.module";
import { SettingsComponent } from "./settings/settings.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "@pipes/pipe.module";
import { TableModule } from "@modules/admin/table/table.module";
import { OrdersFilterComponent } from "@modules/admin/lk/orders/orders-filter/orders-filter.component";
import { OrderGroupComponent } from "@modules/admin/lk/orders/order-group/order-group.component";
import { OrderListComponent } from "./orders/order-list/order-list.component";
import { FeedbackLkModule } from "@modules/feedback/lk/feedback-lk.module";
import { LKCommonComponentModule } from "./common/lk.common.module";

@NgModule({
    declarations: [
        OrdersComponent,
        SettingsComponent,
        OrdersFilterComponent,
        OrderGroupComponent,
        OrderListComponent,
    ],
    imports: [
        CommonModule,
        LKCommonComponentModule,
        LkRoutingModule,
        FeedbackLkModule,
        MenuModule,
        ReactiveFormsModule,
        PipeModule,
        TableModule,
    ],
})
export class LkModule {}
