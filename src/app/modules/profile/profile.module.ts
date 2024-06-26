import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { ProfileModuleRouting } from "app/modules/profile/profile.module,routing";
import { ReactiveFormsModule } from "@angular/forms";
import { LKCommonComponentModule } from "@modules/admin/lk/common/lk.common.module";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { ProfileFriendsComponent } from "./profile-friends/profile-friends.component";
import { SharedModule } from "@shared/shared.module";

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileSettingsComponent,
        ProfileFriendsComponent,
    ],
    imports: [
        CommonModule,
        ProfileModuleRouting,
        ReactiveFormsModule,
        LKCommonComponentModule,
        SharedModule,
    ],
})
export class ProfileModule {}
