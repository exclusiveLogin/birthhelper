import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-lk-bubble",
    templateUrl: "./lk-bubble.component.html",
    styleUrls: ["./lk-bubble.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkBubbleComponent {
    @Input() text: string;
    @Input() mode: "main" | "answer" | "reply";
    @Input() color: "primary" | "accent" | "secondary-accent";
    @Input() editMode: boolean;
    
    constructor() {}

    auto_grow(element: HTMLElement) {
        element.style.height = "5px";
        element.style.height = element.scrollHeight + "px";
    }
}
