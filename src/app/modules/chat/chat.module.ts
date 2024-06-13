import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChatPageComponent } from "./page/chat-page/chat-page.component";
import { ChatModuleRouting } from "@modules/chat/chat.routing.module";
import { LKCommonComponentModule } from "@modules/admin/lk/common/lk.common.module";

@NgModule({
    declarations: [ChatPageComponent],
    imports: [CommonModule, ChatModuleRouting, LKCommonComponentModule],
})
export class ChatModule {}
