import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContragentComponent } from "./contragent.component";

describe("ContragentComponent", () => {
    let component: ContragentComponent;
    let fixture: ComponentFixture<ContragentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContragentComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContragentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
