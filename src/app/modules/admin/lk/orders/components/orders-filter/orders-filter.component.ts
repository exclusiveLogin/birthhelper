import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LkService} from '@services/lk.service';

@Component({
    selector: 'app-orders-filter',
    templateUrl: './orders-filter.component.html',
    styleUrls: ['./orders-filter.component.scss']
})
export class OrdersFilterComponent implements OnInit {

    constructor(
        private lkService: LkService,
    ) {
    }

    filterForm = new FormGroup({
        group_mode: new FormControl('order'),
        status: new FormControl('inwork'),
        section_key: new FormControl('clinic'),
    });

    ngOnInit(): void {
        this.filterForm.valueChanges.subscribe(data => {
            console.log('this.filterForm.valueChanges', data);
            this.lkService.setFilters(data);
        });
        this.filterForm.updateValueAndValidity();
    }

}
