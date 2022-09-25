import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfStudyCategoryComponent } from './fields-of-study-category.component';

describe('FieldsOfStudyCategoryComponent', () => {
  let component: FieldsOfStudyCategoryComponent;
  let fixture: ComponentFixture<FieldsOfStudyCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfStudyCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfStudyCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
