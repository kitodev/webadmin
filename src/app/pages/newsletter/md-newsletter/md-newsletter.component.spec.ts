import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdNewsletterComponent } from './md-newsletter.component';

describe('MdNewsletterComponent', () => {
  let component: MdNewsletterComponent;
  let fixture: ComponentFixture<MdNewsletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdNewsletterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
