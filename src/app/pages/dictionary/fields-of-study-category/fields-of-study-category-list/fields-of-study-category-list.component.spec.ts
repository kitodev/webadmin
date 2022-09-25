import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfStudyCategoryListComponent } from './fields-of-study-category-list.component';

describe('FieldsOfStudyCategoryListComponent', () => {
  let component: FieldsOfStudyCategoryListComponent;
  let fixture: ComponentFixture<FieldsOfStudyCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfStudyCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfStudyCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
