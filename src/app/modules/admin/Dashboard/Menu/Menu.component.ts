import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IMenuGroupItem, IMenuRepoItem} from '../Dashboard.component';
import {MenuService} from '../menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './Menu.component.html',
    styleUrls: ['./Menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {

    expanded: string[] = [];
    @Input() public menuRepo: IMenuGroupItem[];

    constructor(
        private menuServive: MenuService,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit( ) {
    }

    toggleGroup(key: string): void {
      const idx = this.expanded.indexOf(key);
        // tslint:disable-next-line:no-bitwise
      if (!!(~idx)) {
          this.expanded.splice(idx, 1);
      } else {
          this.expanded.push(key);
      }

      this.cdr.markForCheck();
    }

    showed(key: string): boolean {
        // tslint:disable-next-line:no-bitwise
        return !!~this.expanded.indexOf(key);
    }

    public selectMenuItem(item: IMenuRepoItem) {
        this.menuServive.menuStream$.next(item);
    }

}
