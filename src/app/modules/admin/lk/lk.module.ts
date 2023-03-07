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
import { LkAvatarComponent } from "./common/lk-avatar/lk-avatar.component";
import { LkRatingComponent } from "./common/lk-rating/lk-rating.component";
import { LkTitleComponent } from "./common/lk-title/lk-title.component";
import { LkBubbleComponent } from "./common/lk-bubble/lk-bubble.component";
import { LkSimpleCardComponent } from "./common/lk-simple-card/lk-simple-card.component";
import { LkUserCardComponent } from "./common/lk-user-card/lk-user-card.component";
import { LkContactsComponent } from './common/lk-contacts/lk-contacts.component';
import { LkConfirmChanelComponent } from './common/lk-confirm-chanel/lk-confirm-chanel.component';
import { LkRatingGroupComponent } from './common/lk-rating-group/lk-rating-group.component';

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
        LkAvatarComponent,
        LkRatingComponent,
        LkTitleComponent,
        LkBubbleComponent,
        LkSimpleCardComponent,
        LkUserCardComponent,
        LkContactsComponent,
        LkConfirmChanelComponent,
        LkRatingGroupComponent,
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
