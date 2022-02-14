import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveOrderGroupComponent } from './archive-order-group.component';

describe('ArchiveOrderGroupComponent', () => {
  let component: ArchiveOrderGroupComponent;
  let fixture: ComponentFixture<ArchiveOrderGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveOrderGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveOrderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
