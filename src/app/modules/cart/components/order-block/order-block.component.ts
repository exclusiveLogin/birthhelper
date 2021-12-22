import {Component, Input, OnInit} from '@angular/core';
import {Order} from 'app/models/order.interface';
import {SelectionOrderSlot} from 'app/modules/configurator/configurator.model';
import {ConfiguratorService} from 'app/modules/configurator/configurator.service';
import {ImageService} from '../../../../services/image.service';

@Component({
    selector: 'app-order-block',
    templateUrl: './order-block.component.html',
    styleUrls: ['./order-block.component.scss']
})
export class OrderBlockComponent implements OnInit {

    @Input() public orders: Order[];

    constructor(
        private configurator: ConfiguratorService,
        public imageService: ImageService,
    ) {
    }

    ngOnInit(): void {
    }

    removeOrder(order: Order): void {
        const seletion: SelectionOrderSlot = {
            _status: 'selected',
            entKey: order.slot_entity_key,
            entId: order.slot_entity_id,
            id: order.id,
            tabKey: order.tab_key,
            floorKey: order.floor_key,
            sectionKey: order.section_key,
        };

        this.configurator.deselectItemFromCart(seletion);
    }

}
