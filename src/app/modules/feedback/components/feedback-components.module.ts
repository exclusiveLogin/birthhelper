import { NgModule } from '@angular/core';
import { FeedbackFilterComponent } from './feedback-filter/feedback-filter.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContragentCardComponent } from './contragent-card/contragent-card.component';
import { LKCommonComponentModule } from '@modules/admin/lk/common/lk.common.module';
import { RateComponent } from './rate/rate.component';



@NgModule({
  declarations: [
    FeedbackFilterComponent,
    ContragentCardComponent,
    RateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LKCommonComponentModule,
  ],
  exports: [
    FeedbackFilterComponent,
    ContragentCardComponent,
    RateComponent
  ]
})
export class FeedbackComponentsModule { }
