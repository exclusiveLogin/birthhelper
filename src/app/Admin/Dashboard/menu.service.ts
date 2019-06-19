import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenuRepo, EMENUMODE } from './Dashboard.component';

@Injectable()
export class MenuService {

    private menuEventBus: BehaviorSubject<IMenuRepo> = new BehaviorSubject(null);
    private submenuEventBus: BehaviorSubject<EMENUMODE> = new BehaviorSubject(null);

    public get menuStream$(): BehaviorSubject<IMenuRepo>{
        return this.menuEventBus;
    }

    public get submenuStream$(): BehaviorSubject<EMENUMODE>{
        return this.submenuEventBus;
    }

constructor() { }

}
