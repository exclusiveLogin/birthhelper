import { Component } from '@angular/core';
import {AuthService} from './modules/auth-module/auth.service';
import {OrderService} from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private auth: AuthService,
        private orders: OrderService,
        ) {
    }

}
