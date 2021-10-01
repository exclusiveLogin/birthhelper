import { Component, OnInit, Input } from '@angular/core';
import { EMENUMODE } from '../../Dashboard.component';

@Component({
  selector: 'app-SubmenuItem',
  templateUrl: './SubmenuItem.component.html',
  styleUrls: ['./SubmenuItem.component.css']
})
export class SubmenuItemComponent implements OnInit {

  @Input() public title;
  @Input() public mode: EMENUMODE;

  constructor() { }

  public get isCreateMode(): boolean {
    return this.mode === EMENUMODE.CREATE;
  }

  public get isEditMode(): boolean {
    return this.mode === EMENUMODE.EDIT;
  }

  public get isDeleteMode(): boolean {
    return this.mode === EMENUMODE.DELETE;
  }

  ngOnInit() {
  }

}
