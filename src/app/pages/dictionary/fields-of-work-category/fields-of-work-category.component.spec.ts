import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfWorkCategoryComponent } from './fields-of-work-category.component';

describe('FieldsOfWorkCategoryComponent', () => {
  let component: FieldsOfWorkCategoryComponent;
  let fixture: ComponentFixture<FieldsOfWorkCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfWorkCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
