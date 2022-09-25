import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeletionLogsComponent } from './user-deletion-logs.component';

describe('UserDeletionLogsComponent', () => {
  let component: UserDeletionLogsComponent;
  let fixture: ComponentFixture<UserDeletionLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDeletionLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeletionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
