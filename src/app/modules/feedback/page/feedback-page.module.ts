import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackPageComponent } from './feedback-page.component';
import { FeedbackComponentsModule } from '../components/feedback-components.module';
import { LKCommonComponentModule } from '@modules/admin/lk/common/lk.common.module';


const routes: Routes = [
  { path: '', component: FeedbackPageComponent }
];

@NgModule({
  declarations: [
    FeedbackPageComponent
  ],
  imports: [
    CommonModule,
    FeedbackComponentsModule,
    LKCommonComponentModule,
    RouterModule.forChild(routes)
  ]
})
export class FeedbackPageModule { }
