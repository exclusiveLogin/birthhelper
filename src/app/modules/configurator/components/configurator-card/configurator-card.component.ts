import {Component, Input, OnInit} from '@angular/core';
import {TabFloorSetting} from 'app/modules/configurator/configurator.model';
import {Entity, SlotEntity} from 'app/models/entity.interface';
import {environment} from '@environments/environment';
import {IClinicMini} from 'app/models/clinic.interface';

@Component({
    selector: 'app-configurator-card',
    templateUrl: './configurator-card.component.html',
    styleUrls: ['./configurator-card.component.scss']
})
export class ConfiguratorCardComponent implements OnInit {

    url = `${environment.static}/'noimage'`;
    viewEnt: SlotEntity;

    @Input() public cardType: TabFloorSetting['entityType'];
    @Input() public active: boolean;

    @Input() set entity(data: SlotEntity) {
        this.viewEnt = data;
        this.url = `${environment.static}/${data.photo_url || 'noimage'}`;
    }

    constructor() {
    }

    ngOnInit(): void {
    }

}
