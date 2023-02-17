import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AuthAdminGuard } from "@guards/auth.admin.guard";
import { AdminComponent } from "../Admin.component";

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        canActivate: [AuthAdminGuard],
        component: AdminComponent,
    },
    {
        path: "lk",
        loadChildren: () => import("../lk/lk.module").then((m) => m.LkModule),
        canLoad: [AuthAdminGuard],
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    declarations: [],
    exports: [RouterModule],
    providers: [],
})
export class AdminRoutingModule {}
