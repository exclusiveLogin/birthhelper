import {Component, Input, OnInit} from '@angular/core';
import {TabRxInput} from 'app/modules/configurator/configurator.model';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-configurator-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    @Input() tabs$: Observable<TabRxInput[]>;

    constructor() {
    }

    ngOnInit(): void {
    }

}
