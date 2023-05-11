import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackPageComponent } from './feedback-page.component';
import { FeedbackComponentsModule } from '../components/feedback-components.module';


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
    RouterModule.forChild(routes)
  ]
})
export class FeedbackPageModule { }
