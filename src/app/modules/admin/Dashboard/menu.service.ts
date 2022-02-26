import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenuRepoItem, EMENUMODE } from './Dashboard.component';

@Injectable({providedIn: 'root'})
export class MenuService {

    private menuEventBus: BehaviorSubject<IMenuRepoItem> = new BehaviorSubject(null);
    private submenuEventBus: BehaviorSubject<EMENUMODE> = new BehaviorSubject(null);

    public get menuStream$(): BehaviorSubject<IMenuRepoItem> {
        return this.menuEventBus;
    }

    public get submenuStream$(): BehaviorSubject<EMENUMODE> {
        return this.submenuEventBus;
    }

constructor() { }

}
