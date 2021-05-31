import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodesListComponent } from './codes-list.component';

describe('CodesListComponent', () => {
  let component: CodesListComponent;
  let fixture: ComponentFixture<CodesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
