import {Component, Input, OnInit} from '@angular/core';
import {TabFloorSetting} from 'app/modules/configurator/configurator.model';
import {SlotEntity} from 'app/models/entity.interface';
import {environment} from '@environments/environment';
import {Person, PersonSlot} from 'app/models/doctor.interface';

@Component({
    selector: 'app-configurator-card',
    templateUrl: './configurator-card.component.html',
    styleUrls: ['./configurator-card.component.scss']
})
export class ConfiguratorCardComponent implements OnInit {

    url = `${environment.static}/'noimage'`;
    viewEnt: SlotEntity | PersonSlot;

    @Input() public cardType: TabFloorSetting['entityType'];
    @Input() public active: boolean;

    @Input() set entity(data: SlotEntity) {
        this.viewEnt = this.cardType === 'person' ? Person.serializeDoctorSlot(data as PersonSlot) : null;
        this.viewEnt = this.viewEnt ? this.viewEnt : data;

        this.url = `${environment.static}/${this.viewEnt.photo_url || 'noimage'}`;
    }

    constructor() {
    }

    ngOnInit(): void {
        console.log('ConfiguratorCardComponent', this);
    }

}
