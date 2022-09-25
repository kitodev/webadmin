/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PositionHcTabComponent } from './position-hc-tab.component';

describe('PositionHcTabComponent', () => {
  let component: PositionHcTabComponent;
  let fixture: ComponentFixture<PositionHcTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionHcTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionHcTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
