import { Component, OnInit } from "@angular/core";
import { MenuService } from "../menu.service";
import { IMenuRepoItem, EMENUMODE } from "../Dashboard.component";

@Component({
    selector: "app-submenu",
    templateUrl: "./Submenu.component.html",
    styleUrls: ["./Submenu.component.css"],
})
export class SubmenuComponent implements OnInit {
    constructor(private menuService: MenuService) {}

    public menuSelected: IMenuRepoItem;
    public _mode: EMENUMODE.CREATE | EMENUMODE.DELETE | EMENUMODE.EDIT;

    ngOnInit() {
        this.menuService.menuStream$.subscribe((mi) => {
            this.menuSelected = mi;
        });
    }

    public genCreateMode() {
        return EMENUMODE.CREATE;
    }

    public genEditMode() {
        return EMENUMODE.EDIT;
    }

    public genDeleteMode() {
        return EMENUMODE.DELETE;
    }

    public genViewMode() {
        return EMENUMODE.VIEW;
    }

    public get hasCreateMode(): boolean {
        return this.menuSelected.modes.some(
            (mode) => mode === EMENUMODE.CREATE
        );
    }

    public get hasEditMode(): boolean {
        return this.menuSelected.modes.some((mode) => mode === EMENUMODE.EDIT);
    }

    public get hasDeleteMode(): boolean {
        return this.menuSelected.modes.some(
            (mode) => mode === EMENUMODE.DELETE
        );
    }

    public get hasViewMode(): boolean {
        return this.menuSelected.modes.some((mode) => mode === EMENUMODE.VIEW);
    }

    public selectSubmenuMode(mode: string) {
        switch (mode) {
            case "create":
                this.menuService.submenuStream$.next(EMENUMODE.CREATE);
                break;
            case "edit":
                this.menuService.submenuStream$.next(EMENUMODE.EDIT);
                break;
            case "delete":
                this.menuService.submenuStream$.next(EMENUMODE.DELETE);
                break;
            default:
                this.menuService.submenuStream$.next(EMENUMODE.VIEW);
                break;
        }
    }
}
