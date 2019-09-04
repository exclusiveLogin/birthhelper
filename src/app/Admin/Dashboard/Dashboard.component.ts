import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';

export enum EMENUMODE{
  'CREATE',
  'EDIT',
  'DELETE',
}

export interface IMenuRepo{
  name: string,
  containerKey?: string,
  title: string,
  titleVoc: string,
  titleVocs: string,
  type: string,
  modes: EMENUMODE[],
}
@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public selectedMenu: IMenuRepo;
  public selectedMode: EMENUMODE;

  public readonly menuRepo: IMenuRepo[] = [
    {
      name: 'services',
      title: 'Услуги',
      titleVoc: 'услугу',
      titleVocs: 'услуги',
      type: 'entity',
      modes: [
        EMENUMODE.CREATE,
        EMENUMODE.EDIT,
        EMENUMODE.DELETE,
      ]
    },
    {
      name: 'clinics',
      title: 'Клиники',
      titleVoc: 'клинику',
      titleVocs: 'клиники',
      type: 'entity',
      modes: [
        EMENUMODE.CREATE,
        EMENUMODE.EDIT,
        EMENUMODE.DELETE,
      ]
    },
    {
      name: 'phones',
      title: 'Телефоны системы',
      titleVoc: 'телефон',
      titleVocs: 'телефоны',
      type: 'entity',
      modes: [
        EMENUMODE.CREATE,
        EMENUMODE.EDIT,
        EMENUMODE.DELETE,
      ]
    },
    {
      name: 'phone_containers',
      containerKey: 'container_phones',
      title: 'Контейнеры телефонов',
      titleVoc: 'контейнер',
      titleVocs: 'контейнера',
      type: 'container',
      modes: [
        EMENUMODE.CREATE,
        EMENUMODE.DELETE,
        EMENUMODE.EDIT,
      ]
    }
  ]


  constructor(private menuService: MenuService ) { }

  ngOnInit() {

    this.menuService.menuStream$.subscribe( menu => this.selectedMenu = menu);

    this.menuService.submenuStream$.subscribe( mode => this.selectedMode = mode);
  }

  

}
