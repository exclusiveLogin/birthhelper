import {Component, Input, OnInit} from '@angular/core';
import {SearchSection} from '../../../../models/filter.interface';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    @Input() filterConfig: SearchSection[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
