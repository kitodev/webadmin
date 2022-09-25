import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionHcListComponent } from './position-hc-list.component';

describe('PositionHcListComponent', () => {
  let component: PositionHcListComponent;
  let fixture: ComponentFixture<PositionHcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionHcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionHcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
