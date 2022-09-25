import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTypeMdListComponent } from './work-type-md-list.component';

describe('WorkTypeMdListComponent', () => {
  let component: WorkTypeMdListComponent;
  let fixture: ComponentFixture<WorkTypeMdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTypeMdListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTypeMdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
