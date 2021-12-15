import {Component, Input, OnInit} from '@angular/core';
import {Order} from 'app/models/order.interface';

@Component({
    selector: 'app-order-block',
    templateUrl: './order-block.component.html',
    styleUrls: ['./order-block.component.scss']
})
export class OrderBlockComponent implements OnInit {

    @Input() public orders: Order[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
