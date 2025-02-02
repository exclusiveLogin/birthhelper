import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-toggle-container",
    templateUrl: "./toggle-container.component.html",
    styleUrls: ["./toggle-container.component.scss"],
})
export class ToggleContainerComponent {
    @Input() title: string;
    @Input() collapsed: boolean;
    @Input() count: number;

    constructor() {}
}
