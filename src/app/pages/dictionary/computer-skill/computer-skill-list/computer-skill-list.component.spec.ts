import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerSkillListComponent } from './computer-skill-list.component';

describe('ComputerSkillListComponent', () => {
  let component: ComputerSkillListComponent;
  let fixture: ComponentFixture<ComputerSkillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputerSkillListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerSkillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
