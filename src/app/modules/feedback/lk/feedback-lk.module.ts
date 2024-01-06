import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LkFeedbackComponent } from './feedback-lk.component';
import { FeedbackComponentsModule } from '../components/feedback-components.module';
import { LkFeedbackListComponent } from './lk-feedback-list/lk-feedback-list.component';
import { LkFeedbackItemComponent } from './lk-feedback-list/components/lk-feedback-item/lk-feedback-item.component';
import { CommonModule } from '@angular/common';
import { LKCommonComponentModule } from '@modules/admin/lk/common/lk.common.module';



const routes: Routes = [
  { path: '', component: LkFeedbackComponent }
];

@NgModule({
  declarations: [
    LkFeedbackComponent,
    LkFeedbackListComponent,
    LkFeedbackItemComponent,
  ],
  imports: [
    CommonModule,
    FeedbackComponentsModule,
    LKCommonComponentModule,
    RouterModule.forChild(routes)
  ]
})
export class FeedbackLkModule { }
