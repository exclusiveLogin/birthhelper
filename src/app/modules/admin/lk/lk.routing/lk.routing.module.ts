import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthAdminGuard } from "@guards/auth.admin.guard";
import { RouterModule, Routes } from "@angular/router";
import { LkComponent } from "../lk.component";
import { OrdersComponent } from "../orders/orders.component";
import { NotFoundComponent } from "@static/not-found/not-found.component";
import { SettingsComponent } from "../settings/settings.component";
import { LkFeedbackComponent } from "@modules/admin/lk/feedback/lk-feedback/lk-feedback.component";

const routes: Routes = [
    {
        path: "",
        canActivate: [AuthAdminGuard],
        component: LkComponent,
        data: {
            main_menu_mode: "lk",
        },
        children: [
            {
                path: "orders",
                component: OrdersComponent,
                data: {
                    main_menu_mode: "contragents",
                    permission_mode: "orders",
                },
            },
            {
                path: "settings",
                component: SettingsComponent,
                data: {
                    main_menu_mode: "contragents",
                    permission_mode: "settings",
                },
            },
            {
                path: "feedbacks",
                component: LkFeedbackComponent,
                data: {
                    main_menu_mode: "contragents",
                    permission_mode: "feedbacks",
                },
            },
        ],
    },
    { path: "**", component: NotFoundComponent },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LkRoutingModule {}
