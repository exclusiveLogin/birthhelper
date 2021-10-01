import {Component, Input, OnInit} from '@angular/core';
import {Contragent} from '../../../../models/contragent.interface';
import {Observable} from 'rxjs';

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
