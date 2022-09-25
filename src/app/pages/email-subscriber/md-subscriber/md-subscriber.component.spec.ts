import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdSubscriberComponent } from './md-subscriber.component';

describe('MdSubscriberComponent', () => {
  let component: MdSubscriberComponent;
  let fixture: ComponentFixture<MdSubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdSubscriberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
