import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkContactsComponent } from './lk-contacts.component';

describe('LkContactsComponent', () => {
  let component: LkContactsComponent;
  let fixture: ComponentFixture<LkContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
