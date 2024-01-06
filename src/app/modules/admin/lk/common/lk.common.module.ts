import { NgModule } from "@angular/core";
import { ContragentHeaderComponent } from "./contragent-header/contragent-header.component";
import { LikesComponent } from "./likes/likes.component";
import { LkAvatarComponent } from "./lk-avatar/lk-avatar.component";
import { LkBubbleComponent } from "./lk-bubble/lk-bubble.component";
import { LkConfirmChanelComponent } from "./lk-confirm-chanel/lk-confirm-chanel.component";
import { LkContactsComponent } from "./lk-contacts/lk-contacts.component";
import { LkFeedbackMessageComponent } from "./lk-feedback-massage/lk-feedback-message.component";
import { LkMessageDateComponent } from "./lk-message-date/lk-message-date.component";
import { LkRatingComponent } from "./lk-rating/lk-rating.component";
import { LkRatingGroupComponent } from "./lk-rating-group/lk-rating-group.component";
import { LkSimpleCardComponent } from "./lk-simple-card/lk-simple-card.component";
import { LkTitleComponent } from "./lk-title/lk-title.component";
import { LkUserCardComponent } from "./lk-user-card/lk-user-card.component";
import { RepliesComponent } from "./replies/replies.component";
import { LKViewBlocComponent } from "./view-block/lk-view-block.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        ContragentHeaderComponent,
        LikesComponent,
        LkAvatarComponent,
        LkBubbleComponent,
        LkConfirmChanelComponent,
        LkContactsComponent,
        LkFeedbackMessageComponent,
        LkMessageDateComponent,
        LkRatingComponent,
        LkRatingGroupComponent,
        LkSimpleCardComponent,
        LkTitleComponent,
        LkUserCardComponent,
        RepliesComponent,
        LKViewBlocComponent,
    ],
    imports: [CommonModule],
    exports: [
        ContragentHeaderComponent,
        LikesComponent,
        LkAvatarComponent,
        LkBubbleComponent,
        LkConfirmChanelComponent,
        LkContactsComponent,
        LkFeedbackMessageComponent,
        LkMessageDateComponent,
        LkRatingComponent,
        LkRatingGroupComponent,
        LkSimpleCardComponent,
        LkTitleComponent,
        LkUserCardComponent,
        RepliesComponent,
        LKViewBlocComponent,
    ],
})
export class LKCommonComponentModule {}