import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MytransListComponent } from './mytrans-list.component';

describe('MytransListComponent', () => {
  let component: MytransListComponent;
  let fixture: ComponentFixture<MytransListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MytransListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytransListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
