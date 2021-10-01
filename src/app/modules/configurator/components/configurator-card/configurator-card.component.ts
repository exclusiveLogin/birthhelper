import {Component, Input, OnInit} from '@angular/core';
import {TabFloorSetting} from 'app/modules/configurator/configurator.model';
import {SlotEntity} from 'app/models/entity.interface';
import {environment} from '@environments/environment';
import {PersonBuilder, PersonDoctorSlot} from 'app/models/doctor.interface';
import {PlacementBuilder, PlacementSlot} from 'app/models/placement.interface';
import {CardSlot, ConfiguratorCardBuilder} from 'app/models/cardbuilder.interface';

@Component({
    selector: 'app-configurator-card',
    templateUrl: './configurator-card.component.html',
    styleUrls: ['./configurator-card.component.scss']
})
export class ConfiguratorCardComponent implements OnInit {

    url = `${environment.static}/'noimage'`;
    viewEnt: SlotEntity | PersonDoctorSlot | PlacementSlot;

    @Input() public cardType: TabFloorSetting['entityType'];
    @Input() public active: boolean;

    @Input() set entity(data: SlotEntity) {
        this.viewEnt = this.viewEnt ? this.viewEnt :
            this.cardType === 'person' ? PersonBuilder.serialize(data as PersonDoctorSlot) : null;
        this.viewEnt = this.viewEnt ? this.viewEnt :
            this.cardType === 'placement' ? PlacementBuilder.serialize(data as PlacementSlot) : null;
        this.viewEnt = this.viewEnt ? this.viewEnt :
            this.cardType === 'other' ? ConfiguratorCardBuilder.serialize(data as CardSlot) : null;
        this.viewEnt = this.viewEnt ? this.viewEnt : data;

        this.url = `${environment.static}/${this.viewEnt.photo_url || 'noimage'}`;
    }

    constructor() {
    }

    ngOnInit(): void {
        console.log('ConfiguratorCardComponent', this);
    }

}
