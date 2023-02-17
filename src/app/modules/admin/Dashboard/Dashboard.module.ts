import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./Dashboard.component";
import { MenuComponent } from "./Menu/Menu.component";
import { SubmenuComponent } from "./Submenu/Submenu.component";
import { SubmenuItemComponent } from "./Submenu/SubmenuItem/SubmenuItem.component";
import { EditorModule } from "./Editor/Editor.module";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [CommonModule, EditorModule, RouterModule],
    declarations: [
        DashboardComponent,
        MenuComponent,
        SubmenuComponent,
        SubmenuItemComponent,
    ],
    exports: [DashboardComponent, MenuComponent],
})
export class DashboardModule {}
