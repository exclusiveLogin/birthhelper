import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "@static/not-found/not-found.component";
import { WrapperComponent } from "./wrapper.component";
import { AuthUserGuard } from "@guards/user.guard";

const routes: Routes = [
    {
        path: "",
        redirectTo: "search",
        pathMatch: "full",
    },
    {
        path: "search",
        loadChildren: () =>
            import("../modules/search/search.module").then(
                (m) => m.SearchModule
            ),
        component: WrapperComponent,
    },
    {
        path: "configurator",
        loadChildren: () =>
            import("../modules/configurator/configurator.module").then(
                (m) => m.ConfiguratorModule
            ),
        component: WrapperComponent,
    },
    {
        path: "cart",
        loadChildren: () =>
            import("../modules/cart/cart.module").then((m) => m.CartModule),
        component: WrapperComponent,
    },
    {
        path: "profile",
        loadChildren: () =>
            import("../modules/profile/profile.module").then(
                (m) => m.ProfileModule
            ),
        canLoad: [AuthUserGuard],
        component: WrapperComponent,
    },
    {
        path: "feedback",
        loadChildren: () =>
            import("../modules/feedback/feedback.module").then(
                (m) => m.FeedbackModule
            ),
        // canLoad: [AuthUserGuard],
        component: WrapperComponent,
    },
    {
        path: "**",
        component: NotFoundComponent,
    },
];

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
export const WrapperModuleRouting = RouterModule.forChild(routes);
