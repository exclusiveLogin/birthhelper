import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConsultationCardComponent } from "./clinic.card.component";

describe("Clinic.CardComponent", () => {
    let component: ConsultationCardComponent;
    let fixture: ComponentFixture<ConsultationCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConsultationCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConsultationCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
