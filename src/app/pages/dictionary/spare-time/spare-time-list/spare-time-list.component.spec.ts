import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareTimeListComponent } from './spare-time-list.component';

describe('SpareTimeListComponent', () => {
  let component: SpareTimeListComponent;
  let fixture: ComponentFixture<SpareTimeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpareTimeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareTimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
