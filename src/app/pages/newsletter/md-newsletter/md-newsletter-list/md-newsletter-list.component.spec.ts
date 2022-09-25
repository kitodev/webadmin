import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdNewsletterListComponent } from './md-newsletter-list.component';

describe('MdNewsletterListComponent', () => {
  let component: MdNewsletterListComponent;
  let fixture: ComponentFixture<MdNewsletterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdNewsletterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdNewsletterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
