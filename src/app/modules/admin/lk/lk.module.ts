import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LkComponent } from "./lk.component";
import { LkRoutingModule } from "./lk.routing/lk.routing.module";
import { OrdersComponent } from "./orders/orders.component";
import { MenuModule } from "../../menu/menu.module";
import { SettingsComponent } from "./settings/settings.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PipeModule } from "@pipes/pipe.module";
import { TableModule } from "@modules/admin/table/table.module";
import { LKViewBlocComponent } from "@modules/admin/lk/common/view-block/lk-view-block.component";
import { OrdersFilterComponent } from "@modules/admin/lk/orders/orders-filter/orders-filter.component";
import { ContragentHeaderComponent } from "@modules/admin/lk/common/contragent-header/contragent-header.component";
import { OrderGroupComponent } from "@modules/admin/lk/orders/order-group/order-group.component";
import { OrderListComponent } from "./orders/order-list/order-list.component";
import { LkFeedbackComponent } from "./feedback/lk-feedback/lk-feedback.component";
import { LkFeedbackItemComponent } from "./feedback/lk-feedback-item/lk-feedback-item.component";
import { LkFeedbackListComponent } from "./feedback/lk-feedback-list/lk-feedback-list.component";
import { FeedbackFilterComponent } from "@modules/admin/lk/feedback/feedback-filter/feedback-filter.component";

@NgModule({
    declarations: [
        LkComponent,
        OrdersComponent,
        SettingsComponent,
        OrderGroupComponent,
        ContragentHeaderComponent,
        OrdersFilterComponent,
        LKViewBlocComponent,
        OrdersFilterComponent,
        FeedbackFilterComponent,
        ContragentHeaderComponent,
        OrderGroupComponent,
        OrderListComponent,
        LkFeedbackComponent,
        LkFeedbackItemComponent,
        LkFeedbackListComponent,
    ],
    imports: [
        CommonModule,
        LkRoutingModule,
        MenuModule,
        ReactiveFormsModule,
        PipeModule,
        TableModule,
    ],
})
export class LkModule {}
