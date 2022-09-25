import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMdListComponent } from './position-md-list.component';

describe('PositionMdListComponent', () => {
  let component: PositionMdListComponent;
  let fixture: ComponentFixture<PositionMdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionMdListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionMdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
