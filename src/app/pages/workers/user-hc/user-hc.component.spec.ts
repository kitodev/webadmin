import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHcComponent } from './user-hc.component';

describe('UserHcComponent', () => {
  let component: UserHcComponent;
  let fixture: ComponentFixture<UserHcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
