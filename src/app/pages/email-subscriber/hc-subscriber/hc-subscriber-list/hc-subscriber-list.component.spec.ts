import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdSubscriberListComponent } from './hc-subscriber-list.component';

describe('HdSubscriberListComponent', () => {
  let component: HdSubscriberListComponent;
  let fixture: ComponentFixture<HdSubscriberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HdSubscriberListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HdSubscriberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
