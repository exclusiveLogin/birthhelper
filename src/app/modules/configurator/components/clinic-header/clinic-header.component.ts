import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Contragent} from '../../../../models/contragent.interface';

@Component({
  selector: 'app-clinic-header',
  templateUrl: './clinic-header.component.html',
  styleUrls: ['./clinic-header.component.scss']
})
export class ClinicHeaderComponent implements OnInit {

    @Input() contragent$: Observable<Contragent>;
  constructor() { }

  ngOnInit(): void {
  }

}
