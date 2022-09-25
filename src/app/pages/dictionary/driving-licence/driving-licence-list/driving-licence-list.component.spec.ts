import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingLicenceListComponent } from './driving-licence-list.component';

describe('DrivingLicenceListComponent', () => {
  let component: DrivingLicenceListComponent;
  let fixture: ComponentFixture<DrivingLicenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivingLicenceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingLicenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
