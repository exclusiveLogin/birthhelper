import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { registerLocaleData } from "@angular/common";
import localeRu from "@angular/common/locales/ru";

import { AppComponent } from "./app.component";
import { NotFoundComponent } from "@static//not-found/not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { MainComponent } from "./main/main.component";
import { WrapperComponent } from "./wrapper/wrapper.component";
import { NonAuthComponent } from "@modules/auth-module/auth/non-auth/non-auth.component";
import { AuthComponent } from "@modules/auth-module/auth/auth.component";
import { ActivationComponent } from "@modules/auth-module/auth/activation/activation.component";
import { BhDoingComponent } from "./main/components/bh-doing/bh-doing.component";
import { ConfiguratorComponent } from "@modules/configurator/configurator.component";
import { DialogModule } from "@modules/dialog/dialog.module";
import { ToastrModule } from "ngx-toastr";
import { MenuModule } from "@modules/menu/menu.module";
import { DmsFormComponent } from "./main/components/dms.form/dms.form.component";
import { OurAdvantageComponent } from "./main/components/our-advantage/our-advantage.component";
import { AdSliderComponent } from "./main/components/ad-slider/ad-slider.component";

registerLocaleData(localeRu);

const routes: Routes = [
    { path: "", component: MainComponent },
    {
        path: "system",
        loadChildren: () =>
            import("./wrapper/wrapper.module").then((m) => m.WrapperModule),
    },
    {
        path: "admin",
        loadChildren: () =>
            import("./modules/admin/Admin.module").then((m) => m.AdminModule),
    },
    { path: "auth", pathMatch: "full", component: AuthComponent },
    { path: "activation", pathMatch: "full", component: ActivationComponent },
    {
        path: "static/configurator",
        pathMatch: "full",
        component: ConfiguratorComponent,
    },
    { path: "non", pathMatch: "full", component: NonAuthComponent },
    { path: "**", component: NotFoundComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
        MainComponent,
        WrapperComponent,
        ActivationComponent,
        BhDoingComponent,
        DmsFormComponent,
        OurAdvantageComponent,
        AdSliderComponent,
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        DialogModule,
        ToastrModule.forRoot(),
        MenuModule,
    ],
    bootstrap: [AppComponent],
    providers: [{ provide: LOCALE_ID, useValue: "ru" }],
})
export class AppModule {}
