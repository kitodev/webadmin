import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfWorkCategoryListComponent } from './fields-of-work-category-list.component';

describe('FieldsOfWorkCategoryListComponent', () => {
  let component: FieldsOfWorkCategoryListComponent;
  let fixture: ComponentFixture<FieldsOfWorkCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfWorkCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfWorkCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
