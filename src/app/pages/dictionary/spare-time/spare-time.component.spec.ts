import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareTimeComponent } from './spare-time.component';

describe('SpareTimeComponent', () => {
  let component: SpareTimeComponent;
  let fixture: ComponentFixture<SpareTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpareTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
