import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfStudyComponent } from './fields-of-study.component';

describe('FieldsOfStudyComponent', () => {
  let component: FieldsOfStudyComponent;
  let fixture: ComponentFixture<FieldsOfStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfStudyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
