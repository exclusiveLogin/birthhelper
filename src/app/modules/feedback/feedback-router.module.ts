import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '@static/not-found/not-found.component';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';


const routes: Routes = [
  {
    path: "",
    component: FeedbackPageComponent,
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class FeedbackRouterModule { }
