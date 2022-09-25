import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferersListComponent } from './referers-list.component';

describe('ReferersListComponent', () => {
  let component: ReferersListComponent;
  let fixture: ComponentFixture<ReferersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
