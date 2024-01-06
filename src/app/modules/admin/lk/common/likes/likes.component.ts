import { Component, Input } from "@angular/core";

@Component({
    selector: "app-likes",
    templateUrl: "./likes.component.html",
    styleUrls: ["./likes.component.scss"],
})
export class LikesComponent {
    @Input() count: number = 0;
    @Input() self = false;
    @Input() negative = false;
    constructor() {}
}
