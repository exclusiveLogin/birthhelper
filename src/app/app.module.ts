import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {NotFoundComponent} from './NotFound/NotFound.component';
import {HttpClientModule} from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'system', loadChildren: () => import('./wrapper/wrapper.module').then(m => m.WrapperModule)},
  {path: 'admin', loadChildren: () => import('./Admin/Admin.module').then(m => m.AdminModule)},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    MainComponent,
    WrapperComponent,
    MenuComponent
  ],
  imports: [
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'}),
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
