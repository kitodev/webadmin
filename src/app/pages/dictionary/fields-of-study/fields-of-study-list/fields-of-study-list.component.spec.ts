import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfStudyListComponent } from './fields-of-study-list.component';

describe('FieldsOfStudyListComponent', () => {
  let component: FieldsOfStudyListComponent;
  let fixture: ComponentFixture<FieldsOfStudyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfStudyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfStudyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
