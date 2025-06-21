import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { ProfileModuleRouting } from "app/modules/profile/profile.module,routing";
import { ReactiveFormsModule } from "@angular/forms";
import { LKCommonComponentModule } from "@modules/admin/lk/common/lk.common.module";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { ProfileFriendsComponent } from "./profile-friends/profile-friends.component";
import { SharedModule } from "@shared/shared.module";
import { ProfileFriendsSectionComponent } from './profile-friends/profile-friends-section.component';
import { ProfileFriendsListComponent } from './profile-friends/profile-friends-list.component';
import { ProfileFriendItemComponent } from './profile-friends/profile-friend-item.component';
import { ProfileFriendsEmptyComponent } from './profile-friends/profile-friends-empty.component';

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileSettingsComponent,
        ProfileFriendsComponent,
        ProfileFriendsSectionComponent,
        ProfileFriendsListComponent,
        ProfileFriendItemComponent,
        ProfileFriendsEmptyComponent,
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
