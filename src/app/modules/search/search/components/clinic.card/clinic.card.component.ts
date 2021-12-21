import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IClinicMini} from 'app/models/clinic.interface';
import {environment} from '@environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-clinic-card',
    templateUrl: './clinic.card.component.html',
    styleUrls: ['./clinic.card.component.scss']
})
export class ClinicCardComponent implements OnInit {

    viewClinic: IClinicMini = {
        id: -1,
        address: 'Не найден',
        title: 'Пустая клиника',
        photo_url: 'test',
        lon: null,
        lat: null,
        description: 'Какое то описание тестовой клиники',
        stat_value: 0,
        stat_count: 0,
        price_from: 0,
        price_until: 0,
        features: {
            status_iho: null,
            stat_male: 0,
            stat_female: 0,
            mom_with_baby: null,
            license: null,
            has_reanimation: null,
            has_consultation: null,
            has_oms: null,
            has_dms: null,
            free_meets: null,
            foreign_service: null,
        }
    };
    url = `${environment.static}/'noimage'`;

    @Input()
    private set clinic(data: IClinicMini) {
        this.viewClinic = data;
        this.url = data.photo_url;
    }

    @Output() private gotoMap = new EventEmitter<IClinicMini>();

    wrapped = false;

    constructor(private router: Router) {}

    wrap(): void {
        this.wrapped = true;
    }

    ngOnInit(): void {
    }

    showClinicOnMap(): void {
        this.gotoMap.next(this.viewClinic);
    }

    gotoConfigurator(): void {
        this.router.navigate(['/system/configurator/clinic', this.viewClinic.id]).then();
    }
}
