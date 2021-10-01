import { Component, OnInit, Input } from '@angular/core';
import { IMenuRepo } from '../Dashboard.component';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-Menu',
  templateUrl: './Menu.component.html',
  styleUrls: ['./Menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() public menu: IMenuRepo[];

  constructor( private menuServive: MenuService ) { }

  ngOnInit() {
    console.log('menu init:', this.menu);
  }

  public selectMenuItem( item: IMenuRepo ) {
    console.log('selected menu item: ', item);
    this.menuServive.menuStream$.next( item );
  }

}
