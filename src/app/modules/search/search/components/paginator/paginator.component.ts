import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-paginator",
    templateUrl: "./paginator.component.html",
    styleUrls: ["./paginator.component.css"],
})
export class PaginatorComponent implements OnInit {
    pages = 1;

    @Input("pages")
    private set _(value) {
        this.pages = Math.floor(value) + 1;
        if (this.currentPage > this.pages) {
            this.currentPage = this.pages;
        }
    }

    @Output() public vc: EventEmitter<number> = new EventEmitter();

    public currentPage = 1;

    constructor() {}

    ngOnInit() {}

    private emitPage() {
        this.vc.emit(this.currentPage);
    }

    public getPages(): string[] {
        const strArr = [];
        if (this.pages) {
            for (let i = 1; i < this.pages + 1; i++) {
                strArr.push(i);
            }
            return strArr;
        }
    }

    public selectPage(page: number) {
        this.currentPage = page;
        this.emitPage();
    }

    public nextPage() {
        if (this.currentPage < this.pages) {
            this.currentPage++;
            this.emitPage();
        }
    }

    public prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.emitPage();
        }
    }
}
