import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOfWorkListComponent } from './fields-of-work-list.component';

describe('FieldsOfWorkListComponent', () => {
  let component: FieldsOfWorkListComponent;
  let fixture: ComponentFixture<FieldsOfWorkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldsOfWorkListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsOfWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
