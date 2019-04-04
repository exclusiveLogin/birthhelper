import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './Dashboard.component';
import { MenuComponent } from './Menu/Menu.component';
import { SubmenuComponent } from './Submenu/Submenu.component';
import { SubmenuItemComponent } from './Submenu/SubmenuItem/SubmenuItem.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DashboardComponent,
    MenuComponent,
    SubmenuComponent,
    SubmenuItemComponent,
  ],
  exports:[
    DashboardComponent
  ]
})
export class DashboardModule { }
