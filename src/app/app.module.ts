import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { HomeComponent } from './Home/Home.component';
import { NotFoundComponent } from './NotFound/NotFound.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', loadChildren: './Admin/Admin.module#AdminModule' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    RouterModule.forRoot( routes ),
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
