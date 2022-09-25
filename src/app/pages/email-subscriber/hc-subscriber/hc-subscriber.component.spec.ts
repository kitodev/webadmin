import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HDSubscriberComponent } from './hc-subscriber.component';

describe('EmailSubscriberComponent', () => {
  let component: HDSubscriberComponent;
  let fixture: ComponentFixture<HDSubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HDSubscriberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HDSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
