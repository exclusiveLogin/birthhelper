import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { ProfileModuleRouting } from "app/modules/profile/profile.module,routing";
import { ReactiveFormsModule } from "@angular/forms";
import { LKCommonComponentModule } from "@modules/admin/lk/common/lk.common.module";

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileModuleRouting,
        ReactiveFormsModule,
        LKCommonComponentModule,
    ],
})
export class ProfileModule {}
