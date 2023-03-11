import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LkFeedbackMessageComponent } from "app/modules/admin/lk/common/lk-feedback-massage/lk-feedback-message.component";

describe("LkFeedbackMassageComponent", () => {
    let component: LkFeedbackMessageComponent;
    let fixture: ComponentFixture<LkFeedbackMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LkFeedbackMessageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LkFeedbackMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
