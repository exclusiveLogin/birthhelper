import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'


import { AppComponent } from './app.component';
import { HomeComponent } from './Home/Home.component';
import { NotFoundComponent } from './NotFound/NotFound.component';
import { HeaderComponent } from './Header/Header.component';

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
      HeaderComponent
   ],
   imports: [
      RouterModule.forRoot(routes),
      BrowserModule,
      ReactiveFormsModule,
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
