import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from './Admin.component';
import {DashboardModule} from './Dashboard/Dashboard.module';
import {HttpClientModule} from '@angular/common/http';
import {AdminRoutingModule} from './admin-routing/admin-routing.module';
import {NonAuthComponent} from '../auth-module/auth/non-auth/non-auth.component';
import {AuthComponent} from '../auth-module/auth/auth.component';
import {ToastrModule} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        DashboardModule,
        HttpClientModule,
        AdminRoutingModule,
        ToastrModule,
        FormsModule,
    ],
    declarations: [
        AdminComponent,
        NonAuthComponent,
        AuthComponent
    ]
})
export class AdminModule {
}
