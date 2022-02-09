import { Component, OnInit, Input } from '@angular/core';
import { IMenuRepo } from '../Dashboard.component';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './Menu.component.html',
  styleUrls: ['./Menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() public menu: IMenuRepo[];

  constructor( private menuServive: MenuService ) { }

  ngOnInit() {}

  public selectMenuItem( item: IMenuRepo ) {
    this.menuServive.menuStream$.next( item );
  }

}
