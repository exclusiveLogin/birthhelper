import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "@static/not-found/not-found.component";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: "clinics",
        pathMatch: "full",
    },
    {
        path: "clinics",
        component: SearchComponent,
        data: {
            section: "clinic",
        },
    },
    {
        path: "consultations",
        component: SearchComponent,
        data: {
            section: "consultation",
        },
    },
    {
        path: "**",
        component: NotFoundComponent,
    },
];

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
export const SearchModuleRouting = RouterModule.forChild(routes);
