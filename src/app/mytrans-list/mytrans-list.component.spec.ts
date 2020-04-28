import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytransListComponent } from './mytrans-list.component';

describe('MytransListComponent', () => {
  let component: MytransListComponent;
  let fixture: ComponentFixture<MytransListComponent>;

  beforeEach(async(() => {
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
