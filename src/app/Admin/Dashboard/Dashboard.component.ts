import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';

export enum EMENUMODE{
  'CREATE',
  'EDIT',
  'DELETE',
}

export interface IMenuRepo{
  name: string,
  title: string,
  type: string,
  modes: EMENUMODE[],
}
@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private selectedMenu: IMenuRepo;
  public selectedMode: EMENUMODE;

  public readonly menuRepo: IMenuRepo[] = [
    {
      name: 'services',
      title: 'Услуги',
      type: 'entity',
      modes: [
        EMENUMODE.CREATE,
        EMENUMODE.EDIT,
        EMENUMODE.DELETE,
      ]
    }
  ]


  constructor(private menuService: MenuService ) { }

  ngOnInit() {

    this.menuService.menuStream$.subscribe( menu => this.selectedMenu = menu);

    this.menuService.submenuStream$.subscribe( mode => this.selectedMode = mode);
  }

  

}
