import {
    animate,
    animateChild,
    group,
    query,
    state,
    style,
    transition,
    trigger,
} from "@angular/animations";

export const dialogWrapperAnimation = trigger("dialogWrapper", [
    state("void", style({ opacity: 0 })),
    state("*", style({ opacity: 1 })),
    transition(
        "* => *",
        group([query("@dialogState", animateChild()), animate("150ms")])
    ),
]);

export const dialogAnimation = trigger("dialogState", [
    state("void", style({ transform: "matrix(1.2, 0, 0, 0.2, 0, -400)" })),
    state("*", style({ transform: "matrix(1, 0, 0, 1, 0, 0)" })),
    transition(
        ":leave",
        animate("150ms", style({ transform: "matrix(1.2, 0, 0, 0.2, 0, 400)" }))
    ),
    transition(":enter", animate("150ms")),
]);
