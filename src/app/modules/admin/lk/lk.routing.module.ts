import { NgModule } from "@angular/core";
import { AuthAdminGuard } from "@guards/auth.admin.guard";
import { RouterModule, Routes } from "@angular/router";
import { LkComponent } from "./lk.component";
import { OrdersComponent } from "./orders/orders.component";
import { NotFoundComponent } from "@static/not-found/not-found.component";
import { SettingsComponent } from "./settings/settings.component";
import { MenuModule } from "@modules/menu/menu.module";

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
                loadChildren: () =>
                    import("../../feedback/lk/feedback-lk.module").then((m) => m.FeedbackLkModule),
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
    declarations: [LkComponent],
    imports: [RouterModule.forChild(routes), MenuModule],
    exports: [RouterModule],
})
export class LkRoutingModule {}
