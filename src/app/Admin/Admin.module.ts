import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './Admin.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardModule } from './Dashboard/Dashboard.module';
import { DictService } from './dict.service';
import { RestService } from './rest.service';
import { FormService } from './form.service';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  { path: '', component: AdminComponent },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    DashboardModule,
    HttpClientModule,
  ],
  declarations: [
    AdminComponent,
  ],
  providers: [
    DictService,
    RestService,
    FormService,
  ]
})
export class AdminModule { }
