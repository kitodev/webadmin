import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfWorkComponent } from './fields-of-work.component';

describe('FieldsOfWorkComponent', () => {
  let component: FieldsOfWorkComponent;
  let fixture: ComponentFixture<FieldsOfWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
