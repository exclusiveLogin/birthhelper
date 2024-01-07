import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FeedbackPageComponent } from "./feedback-page.component";
import { FeedbackComponentsModule } from "../components/feedback-components.module";
import { LKCommonComponentModule } from "@modules/admin/lk/common/lk.common.module";
import { SharedModule } from "@shared/shared.module";
import { FeedbackPageItemTargetComponent } from "./components/feedback-page-item-target/feedback-page-item-target.component";
import { FeedbackPageItemUserComponent } from "./components/feedback-page-item-user/feedback-page-item-user.component";
import { FormsModule } from "@angular/forms";

const routes: Routes = [{ path: "", component: FeedbackPageComponent }];

@NgModule({
    declarations: [
        FeedbackPageComponent,
        FeedbackPageItemTargetComponent,
        FeedbackPageItemUserComponent,
    ],
    imports: [
        SharedModule,
        CommonModule,
        FeedbackComponentsModule,
        LKCommonComponentModule,
        RouterModule.forChild(routes),
        FormsModule,
    ],
})
export class FeedbackPageModule {}
