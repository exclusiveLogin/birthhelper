import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LkFeedbackItemComponent } from "./lk-feedback-item.component";

describe("LkFeedbackItemComponent", () => {
    let component: LkFeedbackItemComponent;
    let fixture: ComponentFixture<LkFeedbackItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LkFeedbackItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LkFeedbackItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
