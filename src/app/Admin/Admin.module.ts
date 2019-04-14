import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './Admin.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardModule } from './Dashboard/Dashboard.module';
import { DictService } from './dict.service';


const routes: Routes = [
  { path: '', component: AdminComponent },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    DashboardModule,
  ],
  declarations: [
    AdminComponent,
  ],
  providers: [
    DictService
  ]
})
export class AdminModule { }
