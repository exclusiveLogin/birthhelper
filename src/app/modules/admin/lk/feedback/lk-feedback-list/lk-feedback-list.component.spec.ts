import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LkFeedbackListComponent } from "./lk-feedback-list.component";

describe("LkFeedbackListComponent", () => {
    let component: LkFeedbackListComponent;
    let fixture: ComponentFixture<LkFeedbackListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LkFeedbackListComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LkFeedbackListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
