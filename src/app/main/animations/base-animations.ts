import {
    animate,
    animateChild,
    group,
    query,
    sequence,
    state,
    style,
    transition,
    trigger,
} from "@angular/animations";

export const accordionWrapperAnimation = trigger("wrapper", [
    state("closed", style({ height: "70px" })),
    state("opened", style({ height: "*" })),
    transition(
        "closed => opened",
        sequence([animate("150ms"), query("@content", animateChild())])
    ),
    transition(
        "opened => closed",
        sequence([query("@content", animateChild()), animate("150ms")])
    ),
]);

export const contentAnimation = trigger("content", [
    state("opened", style({ opacity: 1 })),
    state("closed", style({ opacity: 0 })),
    transition("* => *", animate("150ms")),
]);
