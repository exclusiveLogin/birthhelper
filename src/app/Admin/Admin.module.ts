import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './Admin.component';
import { DashboardModule } from './Dashboard/Dashboard.module';
import { DictService } from './dict.service';
import { RestService } from './rest.service';
import { FormService } from './form.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { ProviderService } from './table/provider.service';
import { EntityService } from './entity.service';
import { ContainerService } from './container.service';
import { LoaderService } from './loader.service';
import {AdminRoutingModule} from './admin-routing/admin-routing.module';
import {NonAuthComponent} from './auth-module/auth/non-auth/non-auth.component';
import {AuthComponent} from './auth-module/auth/auth.component';
import {ToastrModule} from 'ngx-toastr';


@NgModule({
  imports: [
    CommonModule,
    DashboardModule,
    HttpClientModule,
    AdminRoutingModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    AdminComponent,
    NonAuthComponent,
    AuthComponent
  ],
  providers: [
    DictService,
    RestService,
    FormService,
    ApiService,
    ProviderService,
    EntityService,
    ContainerService,
    LoaderService,
  ]
})
export class AdminModule { }
