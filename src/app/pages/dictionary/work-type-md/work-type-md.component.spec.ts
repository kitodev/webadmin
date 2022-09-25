import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTypeMdComponent } from './work-type-md.component';

describe('WorkTypeMdComponent', () => {
  let component: WorkTypeMdComponent;
  let fixture: ComponentFixture<WorkTypeMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTypeMdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTypeMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
