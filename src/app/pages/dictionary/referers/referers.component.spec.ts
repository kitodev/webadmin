import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferersComponent } from './referers.component';

describe('ReferersComponent', () => {
  let component: ReferersComponent;
  let fixture: ComponentFixture<ReferersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
