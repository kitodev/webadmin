import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWorkersComponent } from './search-workers.component';

describe('SearchWorkersComponent', () => {
  let component: SearchWorkersComponent;
  let fixture: ComponentFixture<SearchWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchWorkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
