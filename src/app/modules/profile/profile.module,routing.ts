import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "@static/not-found/not-found.component";
import { ProfileComponent } from "app/modules/profile/profile.component";

const routes: Routes = [
    {
        path: "",
        component: ProfileComponent,
        data: {
            mode: "settings",
        },
    },
    {
        path: ":id",
        component: ProfileComponent,
        data: {
            mode: "settings",
        },
        children: [
            {
                path: "friends",
                component: ProfileComponent,
                data: {
                    mode: "friends",
                },
            },
        ],
    },
    {
        path: "**",
        component: NotFoundComponent,
    },
];

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
export const ProfileModuleRouting = RouterModule.forChild(routes);
