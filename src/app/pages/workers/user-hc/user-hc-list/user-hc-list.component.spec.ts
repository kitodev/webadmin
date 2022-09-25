import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHcListComponent } from './user-hc-list.component';

describe('UserHcListComponent', () => {
  let component: UserHcListComponent;
  let fixture: ComponentFixture<UserHcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
