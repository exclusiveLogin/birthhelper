import {
    ChangeDetectionStrategy,
    Component,
    Input,
    Output,
} from "@angular/core";
import { EventEmitter } from "@angular/core";

export interface Reply {
    text: string;
    isOfficial: boolean;
}
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
    @Input() canOfficial: boolean;
    @Input() opened: boolean;

    @Output() send: EventEmitter<Reply> = new EventEmitter<Reply>();

    isOfficial: boolean = false;

    constructor() {}

    auto_grow(element: HTMLInputElement) {
        element.style.height = "5px";
        element.style.height = element.scrollHeight + "px";
        this.text = element?.value;
    }

    change(text: string): void {
        this.send.emit({ text, isOfficial: this.isOfficial });
    }

    toggleOfficial(state: Event): void {
        const target: HTMLInputElement = state.target as HTMLInputElement;
        this.isOfficial = !!target.checked;
    }
}
