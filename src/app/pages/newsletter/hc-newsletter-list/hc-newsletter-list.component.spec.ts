import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcNewsletterListComponent } from './hc-newsletter-list.component';

describe('HcNewsletterListComponent', () => {
  let component: HcNewsletterListComponent;
  let fixture: ComponentFixture<HcNewsletterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcNewsletterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HcNewsletterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
