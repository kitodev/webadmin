import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMdComponent } from './position-md.component';

describe('PositionMdComponent', () => {
  let component: PositionMdComponent;
  let fixture: ComponentFixture<PositionMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionMdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
