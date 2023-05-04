import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';
import { FeedbackRouterModule } from "./feedback-router.module";

@NgModule({
    declarations: [
    FeedbackPageComponent
  ],
    imports: [
      CommonModule,
      FeedbackRouterModule
    ],
})
export class FeedbackModule {}
