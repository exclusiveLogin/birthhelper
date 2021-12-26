import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthAdminGuard} from '../../../guards/auth.admin.guard';
import {RouterModule, Routes} from '@angular/router';
import {LkComponent} from '../lk.component';
import {OrdersComponent} from '../orders/orders.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', canActivate: [AuthAdminGuard], component: LkComponent},
    {path: 'orders', component: OrdersComponent},
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class LkRoutingModule {
}
