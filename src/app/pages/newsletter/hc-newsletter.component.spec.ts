import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HCNewsletterComponent } from './hc-newsletter.component';

describe('HCNewsletterComponent', () => {
  let component: HCNewsletterComponent;
  let fixture: ComponentFixture<HCNewsletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HCNewsletterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HCNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
