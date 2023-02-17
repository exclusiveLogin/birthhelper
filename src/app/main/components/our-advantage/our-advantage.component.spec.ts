import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OurAdvantageComponent } from "./our-advantage.component";

describe("OurAdvantageComponent", () => {
    let component: OurAdvantageComponent;
    let fixture: ComponentFixture<OurAdvantageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OurAdvantageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OurAdvantageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
