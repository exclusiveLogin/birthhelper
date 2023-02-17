import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from "@angular/core";
import { IMenuGroupItem, IMenuRepoItem } from "../Dashboard.component";
import { MenuService } from "../menu.service";
import { LkService } from "@services/lk.service";

@Component({
    selector: "app-menu",
    templateUrl: "./Menu.component.html",
    styleUrls: ["./Menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
    expanded: string[] = [];
    @Input() public menuRepo: IMenuGroupItem[];

    constructor(
        private menuServive: MenuService,
        private cdr: ChangeDetectorRef,
        private lkService: LkService
    ) {}

    userHasLkPermission$ = this.lkService.userHasLkPermissions$;
    toggleGroup(key: string): void {
        const idx = this.expanded.indexOf(key);
        // eslint-disable-next-line no-bitwise
        if (!!~idx) {
            this.expanded.splice(idx, 1);
        } else {
            this.expanded.push(key);
        }

        this.cdr.markForCheck();
    }

    showed(key: string): boolean {
        // eslint-disable-next-line no-bitwise
        return !!~this.expanded.indexOf(key);
    }

    public selectMenuItem(item: IMenuRepoItem) {
        this.menuServive.menuStream$.next(item);
    }
}
