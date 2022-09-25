import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMdComponent } from './user-md.component';

describe('UserMdComponent', () => {
  let component: UserMdComponent;
  let fixture: ComponentFixture<UserMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
