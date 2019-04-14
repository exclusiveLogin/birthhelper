import { Component, OnInit } from '@angular/core';
import { DictService } from './dict.service';

@Component({
  selector: 'app-Admin',
  templateUrl: './Admin.component.html',
  styleUrls: ['./Admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor( private dct: DictService ) { }

  ngOnInit() {

  }

}
