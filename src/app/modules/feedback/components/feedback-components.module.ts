import { NgModule } from '@angular/core';
import { FeedbackFilterComponent } from './feedback-filter/feedback-filter.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FeedbackFilterComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [FeedbackFilterComponent]
})
export class FeedbackComponentsModule { }
