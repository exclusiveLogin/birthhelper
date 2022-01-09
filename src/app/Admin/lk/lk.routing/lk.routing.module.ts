import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthAdminGuard} from '../../../guards/auth.admin.guard';
import {RouterModule, Routes} from '@angular/router';
import {LkComponent} from '../lk.component';
import {OrdersComponent} from '../orders/orders.component';
import {NotFoundComponent} from '../../../NotFound/NotFound.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthAdminGuard],
        component: LkComponent,
        data: {
            mode: 'lk',
        },
        children: [
            { path: 'orders', component: OrdersComponent }
        ]},
    {path: '**', component: NotFoundComponent}
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
