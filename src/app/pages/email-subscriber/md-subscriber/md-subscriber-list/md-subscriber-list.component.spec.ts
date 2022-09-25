import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdSubscriberListComponent } from './md-subscriber-list.component';

describe('MdSubscriberListComponent', () => {
  let component: MdSubscriberListComponent;
  let fixture: ComponentFixture<MdSubscriberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdSubscriberListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdSubscriberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
