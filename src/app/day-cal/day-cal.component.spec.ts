import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayCalComponent } from './day-cal.component';

describe('DayCalComponent', () => {
  let component: DayCalComponent;
  let fixture: ComponentFixture<DayCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayCalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});