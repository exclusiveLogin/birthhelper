import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "@static/not-found/not-found.component";
import { CartComponent } from "./cart.component";

const routes: Routes = [
    {
        path: "",
        component: CartComponent,
    },
    {
        path: "**",
        component: NotFoundComponent,
    },
];

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
export const CartModuleRouting = RouterModule.forChild(routes);
