import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-SubmenuItem',
  templateUrl: './SubmenuItem.component.html',
  styleUrls: ['./SubmenuItem.component.css']
})
export class SubmenuItemComponent implements OnInit {

  @Input() public title;

  constructor() { }

  ngOnInit() {
  }

}
