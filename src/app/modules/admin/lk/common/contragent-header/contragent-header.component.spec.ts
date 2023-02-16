import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContragentHeaderComponent } from './contragent-header.component';

describe('ContragentHeaderComponent', () => {
  let component: ContragentHeaderComponent;
  let fixture: ComponentFixture<ContragentHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContragentHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContragentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
