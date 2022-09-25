import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBasedUnsubscriberComponent } from './file-based-unsubscriber.component';

describe('FileBasedUnsubscriberComponent', () => {
  let component: FileBasedUnsubscriberComponent;
  let fixture: ComponentFixture<FileBasedUnsubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileBasedUnsubscriberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileBasedUnsubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
