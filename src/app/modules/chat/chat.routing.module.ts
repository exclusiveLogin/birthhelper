import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "@static/not-found/not-found.component";
import { ChatPageComponent } from "@modules/chat/page/chat-page/chat-page.component";
import { AuthUserGuard } from "@guards/user.guard";

const routes: Routes = [
    {
        path: "",
        component: ChatPageComponent,
        canActivate: [AuthUserGuard],
    },
    {
        path: "**",
        component: NotFoundComponent,
    },
];

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
export const ChatModuleRouting = RouterModule.forChild(routes);
