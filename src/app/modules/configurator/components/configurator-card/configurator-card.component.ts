import {Component, Input, OnInit} from '@angular/core';
import {TabFloorSetting} from 'app/modules/configurator/configurator.model';
import {Entity} from 'app/models/entity.interface';

@Component({
    selector: 'app-configurator-card',
    templateUrl: './configurator-card.component.html',
    styleUrls: ['./configurator-card.component.scss']
})
export class ConfiguratorCardComponent implements OnInit {

    @Input() public cardType: TabFloorSetting['entityType'];
    @Input() public active: boolean;
    @Input() public entity: Entity;

    constructor() {
    }

    ngOnInit(): void {
    }

}
