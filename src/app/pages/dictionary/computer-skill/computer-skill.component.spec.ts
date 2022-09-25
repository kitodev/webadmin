import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerSkillComponent } from './computer-skill.component';

describe('ComputerSkillComponent', () => {
  let component: ComputerSkillComponent;
  let fixture: ComponentFixture<ComputerSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputerSkillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
