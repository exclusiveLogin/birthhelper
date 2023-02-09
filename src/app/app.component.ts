import {Component, OnInit} from '@angular/core';
import {AuthService} from './modules/auth-module/auth.service';
import {OrderService} from './services/order.service';
import {DialogService} from '@modules/dialog/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    constructor(
        private auth: AuthService,
        private orders: OrderService,
        private modal: DialogService,
        ) {

    }

    ngOnInit(): void {
        setTimeout(() =>
        this.modal.showDialogByTemplateKey('feedback_form'), 1000);
    }

}
